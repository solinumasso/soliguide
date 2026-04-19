import Fuse from "fuse.js";
import {
  AutoCompleteType,
  CountryCodes,
  slugString,
  removeAccents,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
  FUSE_SEARCH_SUGGESTIONS_OPTIONS,
  type FormattedSuggestion,
} from "@soliguide/common";
import { ensureDir, writeFile } from "fs-extra";
import { logger } from "../general/logger";
import { getLangsForCountry } from "./utils/getLangsForCountry";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

const SOURCE_ROOT = join(
  process.cwd(),
  "../common/src/search-suggestions/data"
);

class SearchSuggestionsService {
  private fuseIndex: {
    [country in SoliguideCountries]?: {
      [lang in SupportedLanguagesCode]?: Fuse<FormattedSuggestion>;
    };
  } = {};

  private suggestionsCache: {
    [country in SoliguideCountries]?: {
      [lang in SupportedLanguagesCode]?: FormattedSuggestion[];
    };
  } = {};

  // === Runtime (in-memory from resources/) ===

  initialize(): void {
    logger.info(
      "🚀 Initializing search suggestions for all countries & languages..."
    );

    const countries = Object.keys(
      SUPPORTED_LANGUAGES_BY_COUNTRY
    ) as SoliguideCountries[];

    for (const country of countries) {
      const langs = getLangsForCountry(country);
      this.fuseIndex[country] = {};
      this.suggestionsCache[country] = {};

      for (const lang of langs) {
        const data = this.loadFromJson(country, lang);

        if (!data || data.length === 0) {
          logger.warn(`⚠️ No data for country=${country}, lang=${lang}`);
          continue;
        }

        this.suggestionsCache[country]![lang] = data;
        this.fuseIndex[country]![lang] = new Fuse(
          data,
          FUSE_SEARCH_SUGGESTIONS_OPTIONS
        );

        logger.info(
          `✅ Loaded country=${country}, lang=${lang} with ${data.length} elements`
        );
      }
    }
  }

  findBySlugAndLang(
    slug: string,
    lang: SupportedLanguagesCode,
    country: SoliguideCountries = CountryCodes.FR
  ): FormattedSuggestion | null {
    const suggestions = this.getSuggestions(country, lang);
    const normalizedSlug = this.normalizeForMatching(slug);

    return (
      suggestions.find((item) => {
        if (slugString(item.slug) === slug) {
          return true;
        }
        return this.normalizeForMatching(item.slug) === normalizedSlug;
      }) || null
    );
  }

  findBySynonym(
    searchTerm: string,
    lang: SupportedLanguagesCode,
    country: SoliguideCountries = CountryCodes.FR
  ): FormattedSuggestion | null {
    const suggestions = this.getSuggestions(country, lang);
    const slugged = slugString(searchTerm);
    const normalized = this.normalizeForMatching(searchTerm);

    return (
      suggestions.find((suggestion) => {
        if (
          slugString(suggestion.label) === slugged ||
          this.normalizeForMatching(suggestion.label) === normalized
        ) {
          return true;
        }

        return suggestion.synonyms.some(
          (synonym) =>
            slugString(synonym) === slugged ||
            this.normalizeForMatching(synonym) === normalized
        );
      }) ?? null
    );
  }

  findById(
    categoryId: string,
    lang: SupportedLanguagesCode,
    country: SoliguideCountries = CountryCodes.FR
  ): FormattedSuggestion | null {
    const suggestions = this.getSuggestions(country, lang);
    return (
      suggestions.find(
        (item) =>
          item.type === AutoCompleteType.CATEGORY &&
          item.categoryId === categoryId
      ) || null
    );
  }

  // === Source JSON file methods (common/src/search-suggestions/data/) ===

  readSourceFile(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode
  ): FormattedSuggestion[] {
    try {
      const filePath = join(SOURCE_ROOT, country, `${lang}.json`);
      return JSON.parse(readFileSync(filePath, "utf8"));
    } catch {
      return [];
    }
  }

  async writeSourceFile(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    suggestions: FormattedSuggestion[]
  ): Promise<void> {
    const dir = join(SOURCE_ROOT, country);
    await ensureDir(dir);
    const filepath = join(dir, `${lang}.json`);

    await writeFile(filepath, JSON.stringify(suggestions, null, 2), "utf8");

    console.log(
      `  File written: ${relative(process.cwd(), filepath)} (${
        suggestions.length
      } items)`
    );
  }

  getAllSourceCategories(): FormattedSuggestion[] {
    const all: FormattedSuggestion[] = [];
    const countries = Object.keys(
      SUPPORTED_LANGUAGES_BY_COUNTRY
    ) as SoliguideCountries[];

    for (const country of countries) {
      const langs = getLangsForCountry(country);
      for (const lang of langs) {
        const entries = this.readSourceFile(country, lang);
        all.push(
          ...entries.filter((e) => e.type === AutoCompleteType.CATEGORY)
        );
      }
    }

    return all;
  }

  getUntranslatedSourceCategories(): FormattedSuggestion[] {
    return this.getAllSourceCategories().filter(
      (e) => !e.seoTitle || !e.seoDescription
    );
  }

  async addSourceEntry(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    entry: FormattedSuggestion
  ): Promise<void> {
    const entries = this.readSourceFile(country, lang);
    entries.push(entry);
    await this.writeSourceFile(country, lang, entries);
  }

  async updateSourceEntry(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    categoryId: string,
    update: Partial<FormattedSuggestion>
  ): Promise<boolean> {
    const entries = this.readSourceFile(country, lang);
    const index = entries.findIndex(
      (e) => e.type === AutoCompleteType.CATEGORY && e.categoryId === categoryId
    );

    if (index === -1) {
      return false;
    }

    entries[index] = { ...entries[index], ...update };
    await this.writeSourceFile(country, lang, entries);
    return true;
  }

  async removeSourceEntries(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    categoryIds: string[]
  ): Promise<number> {
    const entries = this.readSourceFile(country, lang);
    const idsSet = new Set(categoryIds);
    const filtered = entries.filter(
      (e) =>
        !(
          e.type === AutoCompleteType.CATEGORY &&
          idsSet.has(e.categoryId as string)
        )
    );

    const removed = entries.length - filtered.length;
    if (removed > 0) {
      await this.writeSourceFile(country, lang, filtered);
    }
    return removed;
  }

  // === Private helpers ===

  private normalizeForMatching(str: string): string {
    return removeAccents(str.toLowerCase().trim()).replaceAll(/\s+/g, " ");
  }

  private loadFromJson(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode
  ): FormattedSuggestion[] {
    try {
      const filePath = join(
        process.cwd(),
        "resources",
        "search-suggestions",
        country,
        `${lang}.json`
      );
      return JSON.parse(readFileSync(filePath, "utf8"));
    } catch (error) {
      logger.error(
        `Error reading suggestions file (country=${country}, lang=${lang}):`,
        error
      );
      return [];
    }
  }

  private getSuggestions(
    country: SoliguideCountries,
    lang: SupportedLanguagesCode
  ): FormattedSuggestion[] {
    return this.suggestionsCache[country]?.[lang] ?? [];
  }
}

export const searchSuggestionsService = new SearchSuggestionsService();
