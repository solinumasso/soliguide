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
import Fuse, { IFuseOptions } from "fuse.js";
import { SearchSuggestionsService } from "../services/search-suggestions.service";
import { logger } from "../../general/logger";
import { SearchSuggestion } from "@soliguide/common";

export class SearchSuggestionsController {
  private fuse: Fuse<SearchSuggestion> | null = null;
  private readonly searchService: SearchSuggestionsService;
  private isInitialized = false;

  constructor() {
    this.searchService = new SearchSuggestionsService();
    this.initialize();
  }

  private getFuseOptions(): IFuseOptions<SearchSuggestion> {
    return {
      keys: [
        {
          name: "label",
          weight: 0.8,
        },
        {
          name: "synonyms",
          weight: 0.5,
        },
      ],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      shouldSort: true,
    };
  }

  async initialize(): Promise<void> {
    try {
      const data = await this.searchService.getAllSuggestions();
      if (data.length === 0) {
        logger.warn("Aucune donnée trouvée pour initialiser Fuse.js");
        return;
      }

      this.fuse = new Fuse(data, this.getFuseOptions());
      this.isInitialized = true;
      logger.info(`✅ Fuse.js initialisé avec ${data.length} éléments`);
    } catch (error) {
      logger.error("❌ Erreur lors de l'initialisation de Fuse.js:", error);
      throw error;
    }
  }

  async reload(): Promise<void> {
    logger.info("Rechargement de Fuse.js...");
    this.isInitialized = false;
    await this.initialize();
  }

  public autoComplete = (term: string) => {
    console.log({ term });
    if (!this.fuse) {
      return [];
    }
    const results = this.fuse.search(term, { limit: 7 });

    return results.map((result) => ({
      categoryId: result.item.categoryId,
      label: result.item.label,
      seoTitle: result.item.seoTitle,
      seoDescription: result.item.seoDescription,
      score: result.score,
      matches: result.matches,
    }));
  };
}
export default new SearchSuggestionsController();
