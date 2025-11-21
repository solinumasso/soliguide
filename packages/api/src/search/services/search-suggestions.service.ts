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
import {
  AutoCompleteType,
  SearchSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { logger } from "../../general/logger";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import { FormattedSuggestion } from "../types/FormattedSuggestion.type";

export class SearchSuggestionsService {
  public suggestions: FormattedSuggestion[] = [];
  private isLoaded = false;

  async getAllSuggestions(): Promise<SearchSuggestion[]> {
    try {
      const suggestions = await SearchSuggestionModel.find({}).lean();
      return suggestions as SearchSuggestion[];
    } catch (error) {
      logger.error("Error while fetching all suggestions:", error);
      throw error;
    }
  }

  async getSuggestionsByCountryAndLang(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode
  ): Promise<SearchSuggestion[]> {
    try {
      const suggestions = await SearchSuggestionModel.find({
        country,
        lang,
      }).lean();
      return suggestions as SearchSuggestion[];
    } catch (error) {
      logger.error(
        `Error while fetching suggestions (country=${country}, lang=${lang}):`,
        error
      );
      throw error;
    }
  }

  async loadSuggestions(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    forceReload = false
  ): Promise<void> {
    if (this.isLoaded && !forceReload) {
      logger.info(
        `Suggestions already loaded, skipping (country=${country}, lang=${lang})`
      );
      return;
    }

    try {
      const suggestions = await this.getSuggestionsByCountryAndLang(
        country,
        lang
      );

      if (suggestions.length === 0) {
        logger.warn(
          `No suggestions found in database (country=${country}, lang=${lang})`
        );
        this.suggestions = [];
        this.isLoaded = false;
        return;
      }

      this.suggestions = suggestions.map((suggestion) => ({
        categoryId: suggestion.categoryId,
        label: suggestion.label,
        slug: suggestion.slug,
        synonyms: suggestion.synonyms || [],
        type: suggestion.type,
        lang: suggestion.lang,
        country: suggestion.country,
        seoTitle: suggestion.seoTitle,
        seoDescription: suggestion.seoDescription,
      }));

      this.isLoaded = true;
      logger.info(
        `Suggestions loaded: ${this.suggestions.length} items (country=${country}, lang=${lang})`
      );
    } catch (error) {
      logger.error(
        `Error while loading suggestions (country=${country}, lang=${lang}):`,
        error
      );
      throw error;
    }
  }

  getAllLoadedSuggestions(): FormattedSuggestion[] {
    return this.suggestions;
  }

  findBySlug(slug: string): FormattedSuggestion | null {
    if (!this.isLoaded) {
      logger.warn("Service not initialized. Call loadSuggestions() first.");
      return null;
    }
    return this.suggestions.find((item) => item.slug === slug) || null;
  }

  findById(categoryId: string): FormattedSuggestion | null {
    if (!this.isLoaded) {
      logger.warn("Service not initialized. Call loadSuggestions() first.");
      return null;
    }
    return (
      this.suggestions.find(
        (item) =>
          item.type === AutoCompleteType.CATEGORY &&
          item.categoryId === categoryId
      ) || null
    );
  }

  findBySynonym(searchTerm: string): FormattedSuggestion | null {
    if (!this.isLoaded) {
      logger.warn("Service not initialized. Call loadSuggestions() first.");
      return null;
    }

    const normalized = searchTerm.toLowerCase().trim();

    return (
      this.suggestions.find((suggestion) => {
        if (suggestion.label.toLowerCase().trim() === normalized) {
          return true;
        }
        return suggestion.synonyms.some(
          (synonym) => synonym.toLowerCase().trim() === normalized
        );
      }) ?? null
    );
  }

  generate(): FormattedSuggestion[] {
    return this.suggestions;
  }

  reset(): void {
    this.suggestions = [];
    this.isLoaded = false;
  }
}

export default new SearchSuggestionsService();
