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
import autocompleteSuggestionService from "../../services/search-suggestions.service";
import { parseTextSearch } from "./parse-text-search";

export function buildEnhancedWordSearch(
  searchData: any,
  nosqlQuery: any,
  lang: string = "fr"
): void {
  if (!searchData.word) return;

  const searchTerm = searchData.word.trim();
  const foundSuggestion = findSuggestionBySynonym(searchTerm, lang);

  console.log({ foundSuggestion });
  if (foundSuggestion) {
    buildSynonymSearch(nosqlQuery, foundSuggestion);
  } else {
    buildSimpleSearch(nosqlQuery, searchTerm);
  }
}

function buildSynonymSearch(nosqlQuery: any, suggestion: any): void {
  const allTerms = [suggestion.label, ...suggestion.synonyms].filter(Boolean);
  console.table(allTerms);
  if (allTerms.length > 0) {
    const regexTerms = allTerms.map((term) => createWordBoundaryRegex(term));

    console.log(regexTerms);
    nosqlQuery["slugs.infos.name"] = { $in: regexTerms };
  }
}

function buildSimpleSearch(nosqlQuery: any, searchTerm: string): void {
  const tempQuery = { word: "" };
  parseTextSearch(tempQuery, { word: searchTerm }, "word");
  nosqlQuery["slugs.infos.name"] = tempQuery.word;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function findSuggestionBySynonym(searchTerm: string, _lang: string) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const suggestionBySlug =
    autocompleteSuggestionService.findBySlug(normalizedSearch);

  if (suggestionBySlug) {
    return suggestionBySlug;
  }

  return autocompleteSuggestionService.findBySynonym(searchTerm);
}

function createWordBoundaryRegex(term: string): RegExp {
  const escaped = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}
