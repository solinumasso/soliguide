import { AutoCompleteType, SearchSuggestion } from "@soliguide/common";
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
      logger.error("Erreur lors de la récupération des suggestions:", error);
      throw error;
    }
  }

  async getSuggestionsByLang(lang: string): Promise<SearchSuggestion[]> {
    try {
      const suggestions = await SearchSuggestionModel.find({ lang }).lean();
      return suggestions as SearchSuggestion[];
    } catch (error) {
      logger.error(
        "Erreur lors de la récupération des suggestions par langue:",
        error
      );
      throw error;
    }
  }

  async loadSuggestions(lang: string): Promise<void> {
    if (this.isLoaded) return;

    try {
      const suggestions = await this.getSuggestionsByLang(lang);

      this.suggestions = suggestions.map((suggestion) => ({
        categoryId: suggestion.categoryId,
        label: suggestion.label,
        slug: suggestion.slug,
        synonyms: suggestion.synonyms || [],
        type: suggestion.type,
        seoTitle: suggestion.seoTitle,
        seoDescription: suggestion.seoDescription,
      }));

      this.isLoaded = true;
      logger.info(
        `✅ Suggestions chargées: ${this.suggestions.length} éléments`
      );
    } catch (error) {
      logger.error("❌ Erreur lors du chargement des suggestions:", error);
      throw error;
    }
  }

  getAllLoadedSuggestions(): FormattedSuggestion[] {
    return this.suggestions;
  }

  findBySlug(slug: string): FormattedSuggestion | null {
    if (!this.isLoaded) {
      logger.warn("Service pas initialisé");
      return null;
    }

    return this.suggestions.find((item) => item.slug === slug) || null;
  }

  findById(categoryId: string): FormattedSuggestion | null {
    if (!this.isLoaded) {
      logger.warn("Service pas initialisé");
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
      logger.warn("Service pas initialisé");
      return null;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();

    return (
      this.suggestions.find((suggestion) => {
        if (suggestion.label.toLowerCase().trim() === normalizedSearch) {
          return true;
        }

        return suggestion.synonyms.some(
          (synonym) => synonym.toLowerCase().trim() === normalizedSearch
        );
      }) ?? null
    );
  }

  generate(): FormattedSuggestion[] {
    return this.suggestions;
  }
}

const autocompleteSuggestionService = new SearchSuggestionsService();
export default autocompleteSuggestionService;
