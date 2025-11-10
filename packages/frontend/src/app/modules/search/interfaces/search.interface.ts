/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
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
import {
  AutoCompleteType,
  Categories,
  GeoPosition,
  PlaceType,
  SearchFilterClosure,
  SearchModalities,
  SearchPublics,
  SearchSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../../models";

export class Search {
  public category?: Categories | null;

  // Category display
  public label: string | null;
  public word: string | null;

  public location: GeoPosition;

  // Paramètres
  public openToday?: boolean;
  public country: SoliguideCountries = THEME_CONFIGURATION.country;
  public publics?: SearchPublics;
  public modalities?: SearchModalities;
  public languages: SupportedLanguagesCode | null;

  public placeType: PlaceType;

  // Fermeture temporaire dans l'admin
  public close?: SearchFilterClosure;

  public options: {
    limit: number;
    page: number;
  };

  constructor(data?: Partial<Search>) {
    this.category = null;

    this.label = data?.label ?? null;
    this.word = data?.word ?? null;

    this.location = new GeoPosition({});

    this.openToday = data?.openToday ?? undefined;
    this.modalities = data?.modalities ?? undefined;
    this.publics = data?.publics ?? undefined;
    this.languages = data?.languages ?? null;
    this.placeType = data?.placeType ?? PlaceType.PLACE;
    this.close = data?.close ?? null;
    this.options = data?.options ?? {
      limit: 20,
      page: 1,
    };

    if (data) {
      this.location = new GeoPosition(data.location);

      if (data.category) {
        this.category = data.category;
        this.word = null;
      }
    }
  }

  public resetSearchTerms(): void {
    this.category = null;
    this.word = null;
    this.label = null;
  }

  public setCategory(categoryId: Categories, label?: string): void {
    this.category = categoryId;
    this.word = null;
    if (label) {
      this.label = label;
    }
  }

  public setWord(word: string, label?: string): void {
    this.word = word;
    this.category = null;
    if (label) {
      this.label = label;
    }
  }

  public applySearchSuggestion(suggestion: SearchSuggestion): void {
    console.warn("applySearchSuggestion");
    this.resetSearchTerms();

    if (suggestion.type === AutoCompleteType.CATEGORY) {
      this.category = suggestion.categoryId;
    } else {
      this.word = suggestion.slug;
    }
    this.label = suggestion.label;
  }
}
