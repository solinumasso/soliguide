import Fuse, { IFuseOptions } from "fuse.js";
import { SearchSuggestionsService } from "../services/search-suggestions.service";
import { logger } from "../../general/logger";
import {
  SearchSuggestion,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { getLangsForCountry } from "../utils/getLangsForCountry";

export class SearchSuggestionsController {
  private fuseIndex: {
    [country in SoliguideCountries]?: {
      [lang in SupportedLanguagesCode]?: Fuse<SearchSuggestion>;
    };
  } = {};

  private readonly searchService: SearchSuggestionsService;
  private isInitialized = false;

  constructor() {
    this.searchService = new SearchSuggestionsService();
  }

  private getFuseOptions(): IFuseOptions<SearchSuggestion> {
    return {
      keys: [
        { name: "label", weight: 0.8 },
        { name: "synonyms", weight: 0.5 },
      ],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      shouldSort: true,
    };
  }

  async initialize(): Promise<void> {
    try {
      logger.info(
        "🚀 Initializing Fuse.js indices for all countries & languages..."
      );

      const countries = Object.keys(
        SUPPORTED_LANGUAGES_BY_COUNTRY
      ) as SoliguideCountries[];

      for (const country of countries) {
        const langs = getLangsForCountry(country);

        this.fuseIndex[country] = {};

        for (const lang of langs) {
          const data = await this.searchService.getSuggestionsByCountryAndLang(
            country,
            lang
          );

          if (!data || data.length === 0) {
            logger.warn(`⚠️ No data for country=${country}, lang=${lang}`);
            continue;
          }

          this.fuseIndex[country]![lang] = new Fuse(
            data,
            this.getFuseOptions()
          );
          logger.info(
            `✅ Fuse.js initialized for country=${country}, lang=${lang} with ${data.length} elements`
          );
        }
      }

      this.isInitialized = true;
    } catch (error) {
      logger.error("❌ Error during Fuse.js initialization:", error);
      throw error;
    }
  }

  async reload(): Promise<void> {
    logger.info("♻️ Reloading Fuse.js indices...");
    this.isInitialized = false;
    this.fuseIndex = {};
    await this.initialize();
  }

  public autoComplete(
    term: string,
    country: SoliguideCountries,
    lang: SupportedLanguagesCode
  ) {
    if (!this.isInitialized) {
      logger.warn("⚠️ Fuse.js not initialized yet");
      return [];
    }

    const fuse = this.fuseIndex[country]?.[lang];
    if (!fuse) {
      logger.warn(
        `⚠️ No Fuse instance found for country=${country}, lang=${lang}`
      );
      return [];
    }

    const results = fuse.search(term, { limit: 7 });

    return results.map((result) => ({
      categoryId: result.item.categoryId,
      label: result.item.label,
      seoTitle: result.item.seoTitle,
      seoDescription: result.item.seoDescription,
      country,
      lang,
      type: result.item.type,
      score: result.score,
      matches: result.matches,
    }));
  }
}

export default new SearchSuggestionsController();
