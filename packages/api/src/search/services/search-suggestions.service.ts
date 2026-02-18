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
  slugString,
  removeAccents,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { logger } from "../../general/logger";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import { FormattedSuggestion } from "../types/FormattedSuggestion.type";

export class SearchSuggestionsService {
  public suggestions: FormattedSuggestion[] = [];
  private isLoaded = false;
  private currentLang: SupportedLanguagesCode | null = null;
  private currentCountry: SoliguideCountries | null = null;
  private readonly defaultLang: SupportedLanguagesCode =
    SupportedLanguagesCode.FR;

  /**
   * Normalize string for matching: removes accents, converts to lowercase, and trims
   * This provides better matching for user searches regardless of accent usage
   */
  private normalizeForMatching(str: string): string {
    return removeAccents(str.toLowerCase().trim()).replace(/\s+/g, " ");
  }

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
    if (
      this.isLoaded &&
      !forceReload &&
      this.currentLang === lang &&
      this.currentCountry === country
    ) {
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

      this.currentLang = lang;
      this.currentCountry = country;
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

  findBySlugAndLang(
    slug: string,
    lang?: SupportedLanguagesCode
  ): FormattedSuggestion | null {
    const resolvedLang = lang || this.defaultLang;
    if (!this.isLoaded || this.currentLang !== resolvedLang) {
      logger.warn(
        "Service not initialized or different language loaded. Call loadSuggestions() first."
      );
      return null;
    }

    // Normalize the search slug for accent-insensitive matching
    const normalizedSlug = this.normalizeForMatching(slug);

    return (
      this.suggestions.find((item) => {
        // Try exact slug match first (fast path)
        if (slugString(item.slug) === slug) {
          return true;
        }
        // Fallback to normalized matching for accent tolerance
        return this.normalizeForMatching(item.slug) === normalizedSlug;
      }) || null
    );
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

  findBySynonym(
    searchTerm: string,
    lang?: SupportedLanguagesCode
  ): FormattedSuggestion | null {
    const resolvedLang = lang || this.defaultLang;
    if (!this.isLoaded || this.currentLang !== resolvedLang) {
      logger.warn(
        "Service not initialized or different language loaded. Call loadSuggestions() first."
      );
      return null;
    }

    // Use both slugString (for backward compatibility) and normalized matching (for accent tolerance)
    const slugged = slugString(searchTerm);
    const normalized = this.normalizeForMatching(searchTerm);

    return (
      this.suggestions.find((suggestion) => {
        // Check label match (exact slug or normalized)
        if (
          slugString(suggestion.label) === slugged ||
          this.normalizeForMatching(suggestion.label) === normalized
        ) {
          return true;
        }

        // Check synonyms match (exact slug or normalized)
        return suggestion.synonyms.some(
          (synonym) =>
            slugString(synonym) === slugged ||
            this.normalizeForMatching(synonym) === normalized
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
    this.currentLang = null;
    this.currentCountry = null;
  }
}

export default new SearchSuggestionsService();
