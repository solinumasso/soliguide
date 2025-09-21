/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
  AutoCompleteType,
  Categories,
  SearchSuggestion,
  SupportedLanguagesCode,
} from "@soliguide/common";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { BehaviorSubject, firstValueFrom, Subscription } from "rxjs";
import { CurrentLanguageService } from "../../general/services/current-language.service";

interface SuggestionData {
  lang: SupportedLanguagesCode;
  updatedAt: Date;
  content: SearchSuggestion[];
}

@Injectable({
  providedIn: "root",
})
export class SearchBarService implements OnDestroy {
  private fuse: Fuse<SearchSuggestion> | null = null;
  private isInitialized = false;
  private readonly initializationSubject = new BehaviorSubject<boolean>(false);
  private allSuggestions: SearchSuggestion[] = [];
  private currentLanguage: SupportedLanguagesCode;

  private readonly subscription = new Subscription();

  private readonly DB_NAME = "SoliguideDB";
  private readonly STORE_NAME = "suggestions";

  public initialization$ = this.initializationSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.currentLanguage = this.currentLanguageService.currentLanguage;

    this.subscription.add(
      this.currentLanguageService.subscribe(
        (newLanguage: SupportedLanguagesCode) => {
          console.log({ newLanguage });
          if (newLanguage !== this.currentLanguage) {
            this.currentLanguage = newLanguage;
            this.initialize();
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: "lang" });
        }
      };
    });
  }

  private async getFromDB(): Promise<SuggestionData | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readonly");
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve) => {
        const request = store.get(this.currentLanguage);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            result.updatedAt = new Date(result.updatedAt);
          }
          resolve(result || null);
        };
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private async saveToDB(data: SuggestionData): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Erreur sauvegarde IndexedDB:", error);
    }
  }

  private getFuseOptions(): IFuseOptions<SearchSuggestion> {
    return {
      isCaseSensitive: false,
      ignoreDiacritics: true,
      includeScore: true,
      includeMatches: false,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: false,
      keys: [
        { name: "label", weight: 4 },
        { name: "synonyms", weight: 1 },
      ],
      location: 0,
      threshold: 0.1,
      distance: 20,
      ignoreLocation: true,
      useExtendedSearch: false,
      ignoreFieldNorm: true,
      fieldNormWeight: 1,
    };
  }

  private async loadSuggestions(): Promise<SearchSuggestion[]> {
    const cached = await this.getFromDB();
    if (cached) {
      console.log(
        `📋 Données trouvées en IndexedDB pour ${this.currentLanguage}`
      );
      return cached.content;
    }

    try {
      console.log(
        `🌐 Chargement ${this.currentLanguage}.json depuis le serveur`
      );
      const data = await firstValueFrom(
        this.http.get<SearchSuggestion[]>(
          `/assets/files/${this.currentLanguage}.json`
        )
      );

      await this.saveToDB({
        lang: this.currentLanguage,
        updatedAt: new Date(),
        content: data,
      });

      console.log(`✅ ${this.currentLanguage}.json sauvegardé en IndexedDB`);
      return data;
    } catch (error) {
      console.error(
        `❌ Erreur chargement ${this.currentLanguage}.json:`,
        error
      );
      return [];
    }
  }

  async initialize(): Promise<void> {
    this.isInitialized = false;
    this.initializationSubject.next(false);

    const data = await this.loadSuggestions();

    if (data.length === 0) {
      console.warn(`⚠️ Aucune donnée pour ${this.currentLanguage}`);
      return;
    }

    // Remplacer les données en mémoire
    this.allSuggestions = data;
    this.fuse = new Fuse(data, this.getFuseOptions());
    this.isInitialized = true;
    this.initializationSubject.next(true);

    console.log(
      `✅ ${this.currentLanguage} chargé en mémoire: ${data.length} éléments`
    );
  }

  async reload(lang: SupportedLanguagesCode): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);
      store.delete(lang);
    } catch (error) {
      console.error("Erreur suppression IndexedDB:", error);
    }

    await this.initialize();
  }

  public findBySlug(slug: string): SearchSuggestion | null {
    if (!this.isInitialized) return null;
    return this.allSuggestions.find((item) => item.slug === slug) || null;
  }

  public findByCategoryId(categoryId: Categories): SearchSuggestion | null {
    if (!this.isInitialized) return null;
    return (
      this.allSuggestions.find(
        (item) =>
          item.type === AutoCompleteType.CATEGORY &&
          item.categoryId === categoryId
      ) || null
    );
  }

  public autoComplete(term: string): FuseResult<SearchSuggestion>[] {
    if (!this.fuse || !this.isInitialized) return [];
    return this.fuse.search(term, { limit: 7 });
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}
