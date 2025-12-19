/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
import { THEME_CONFIGURATION } from "../../../models";

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
  private initializationPromise: Promise<void> | null = null;
  private readonly initializationSubject = new BehaviorSubject<boolean>(false);
  private allSuggestions: SearchSuggestion[] = [];
  private currentLanguage: SupportedLanguagesCode;
  private loadedLanguage: SupportedLanguagesCode | null = null;

  private readonly subscription = new Subscription();

  private readonly DB_NAME = "SoliguideDB";
  private readonly STORE_NAME = "suggestions";
  private readonly COUNTRY = THEME_CONFIGURATION.country;

  public initialization$ = this.initializationSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.currentLanguage = this.currentLanguageService.currentLanguage;

    this.subscription.add(
      this.currentLanguageService.subscribe(
        (newLanguage: SupportedLanguagesCode) => {
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
          db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  private getCacheKey(country: string, lang: SupportedLanguagesCode): string {
    return `${country}_${lang}`;
  }

  private async getFromDB(
    country: string,
    lang: SupportedLanguagesCode
  ): Promise<SuggestionData | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readonly");
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve) => {
        const key = this.getCacheKey(country, lang);
        const request = store.get(key);
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

  private async saveToDB(
    country: string,
    lang: SupportedLanguagesCode,
    content: SearchSuggestion[]
  ): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const data = {
          id: this.getCacheKey(country, lang),
          lang,
          updatedAt: new Date(),
          content,
        };
        const request = store.put(data);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error saving to IndexedDB:", error);
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
        { name: "label", weight: 10 },
        { name: "synonyms", weight: 1 },
      ],
      location: 0,
      threshold: 0.1,
      distance: 100,
      ignoreLocation: true,
      useExtendedSearch: false,
      ignoreFieldNorm: true,
    };
  }

  private async loadSuggestions(
    country: string,
    lang: SupportedLanguagesCode
  ): Promise<SearchSuggestion[]> {
    const cached = await this.getFromDB(country, lang);
    if (cached) {
      console.log(`Data found in IndexedDB for ${country}/${lang}`);
      return cached.content;
    }

    try {
      console.log(`Loading ${country}/${lang}.json from server`);
      const data = await firstValueFrom(
        this.http.get<SearchSuggestion[]>(
          `/assets/files/${country}/${lang}.json`
        )
      );

      await this.saveToDB(country, lang, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${country}/${lang}.json:`, error);
      return [];
    }
  }

  async initialize(): Promise<void> {
    if (
      this.initializationPromise &&
      this.loadedLanguage === this.currentLanguage
    ) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    if (this.loadedLanguage === this.currentLanguage && this.isInitialized) {
      console.log(
        `Suggestions already loaded for ${this.COUNTRY}/${this.currentLanguage}`
      );
      return;
    }

    this.isInitialized = false;
    this.initializationSubject.next(false);

    const data = await this.loadSuggestions(this.COUNTRY, this.currentLanguage);

    if (data.length === 0) {
      console.warn(
        `No data available for ${this.COUNTRY}/${this.currentLanguage}`
      );
      this.loadedLanguage = null;
      return;
    }

    this.allSuggestions = data;
    this.fuse = new Fuse(data, this.getFuseOptions());
    this.isInitialized = true;
    this.loadedLanguage = this.currentLanguage;
    this.initializationSubject.next(true);

    console.log(
      `${this.COUNTRY}/${this.currentLanguage} loaded: ${data.length} items`
    );
  }

  async reload(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], "readwrite");
      const store = transaction.objectStore(this.STORE_NAME);
      const key = this.getCacheKey(this.COUNTRY, this.currentLanguage);
      store.delete(key);
    } catch (error) {
      console.error("Error deleting from IndexedDB:", error);
    }

    this.loadedLanguage = null;
    this.initializationPromise = null;
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
    return this.fuse.search(term, { limit: 6 });
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}
