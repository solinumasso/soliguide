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
import { Injectable } from "@angular/core";
import {
  AutoCompleteType,
  Categories,
  SearchSuggestion,
  SupportedLanguagesCode,
} from "@soliguide/common";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { BehaviorSubject, firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SearchBarService {
  private fuse: Fuse<SearchSuggestion> | null = null;
  private isInitialized = false;
  private readonly initializationSubject = new BehaviorSubject<boolean>(false);
  private allSuggestions: SearchSuggestion[] = [];

  public initialization$ = this.initializationSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  private getFuseOptions(): IFuseOptions<SearchSuggestion> {
    return {
      // BASIC OPTIONS
      isCaseSensitive: false,
      ignoreDiacritics: true,
      includeScore: true,
      includeMatches: false,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: false,
      keys: [
        {
          name: "label",
          weight: 4,
        },
        {
          name: "synonyms",
          weight: 1,
        },
      ],

      // FUZZY MATCHING OPTIONS
      location: 0,
      threshold: 0.1,
      distance: 20,
      ignoreLocation: true,

      // ADVANCED OPTIONS
      useExtendedSearch: false,
      ignoreFieldNorm: true,
      fieldNormWeight: 1,
    };
  }

  public findBySlug(slug: string): SearchSuggestion | null {
    console.log(this.allSuggestions);
    if (!this.isInitialized || this.allSuggestions.length === 0) {
      console.warn(
        "SearchBarService n'est pas initialisé ou aucune donnée disponible"
      );
      return null;
    }

    const foundItem = this.allSuggestions.find((item) => item.slug === slug);

    return foundItem || null;
  }

  public findByCategoryId(categoryId: Categories): SearchSuggestion | null {
    if (!this.isInitialized || this.allSuggestions.length === 0) {
      console.warn(
        "SearchBarService n'est pas initialisé ou aucune donnée disponible"
      );
      return null;
    }

    const foundItem = this.allSuggestions.find(
      (item) =>
        item.type === AutoCompleteType.CATEGORY &&
        item.categoryId === categoryId
    );

    return foundItem || null;
  }

  private async loadSuggestions(
    lang: string = "fr"
  ): Promise<SearchSuggestion[]> {
    try {
      const data = await firstValueFrom(
        this.http.get<SearchSuggestion[]>(`/assets/files/${lang}.json`)
      );
      return data;
    } catch (error) {
      console.error(
        `❌ Erreur lors du chargement des suggestions pour la langue ${lang}:`,
        error
      );
      return [];
    }
  }

  async initialize(
    lang: SupportedLanguagesCode = SupportedLanguagesCode.FR
  ): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const data = await this.loadSuggestions(lang);

      if (data.length === 0) {
        console.warn("Aucune donnée trouvée pour initialiser Fuse.js");
        return;
      }

      this.allSuggestions = data; // Sauvegarder les données
      this.fuse = new Fuse(data, this.getFuseOptions());
      this.isInitialized = true;
      this.initializationSubject.next(true);
      console.log(`✅ Fuse.js initialisé avec ${data.length} éléments`);
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de Fuse.js:", error);
      this.initializationSubject.next(false);
      throw error;
    }
  }

  async reload(
    lang: SupportedLanguagesCode = SupportedLanguagesCode.FR
  ): Promise<void> {
    console.log("Rechargement de Fuse.js...");
    this.isInitialized = false;
    this.initializationSubject.next(false);
    await this.initialize(lang);
  }

  public autoComplete(term: string): FuseResult<SearchSuggestion>[] {
    console.log({ term });

    if (!this.fuse || !this.isInitialized) {
      console.warn("Fuse.js n'est pas initialisé");
      return [];
    }

    return this.fuse.search(term, { limit: 7 });
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}
