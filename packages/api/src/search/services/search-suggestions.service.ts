import { SearchSuggestion } from "@soliguide/common";
import { logger } from "../../general/logger";
import { SearchSuggestionModel } from "../models";

export class SearchSuggestionsService {
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
}
