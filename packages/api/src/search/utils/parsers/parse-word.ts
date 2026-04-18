import { AutoCompleteType, SupportedLanguagesCode } from "@soliguide/common";
import autocompleteSuggestionService from "../../services/search-suggestions.service";
import { FormattedSuggestion } from "../../types";
import { parseTextSearch } from "./parse-text-search";

export function buildEnhancedWordSearch(
  searchData: any,
  nosqlQuery: any,
  lang: SupportedLanguagesCode = SupportedLanguagesCode.FR
): void {
  if (!searchData?.word) {
    return;
  }

  const searchTerm = searchData.word;
  const foundSuggestion = findSuggestionBySynonym(searchTerm, lang);

  if (foundSuggestion) {
    buildSynonymSearch(nosqlQuery, foundSuggestion);
  } else {
    buildSimpleSearch(nosqlQuery, searchTerm);
  }
}

function buildSynonymSearch(
  nosqlQuery: any,
  suggestion: FormattedSuggestion
): void {
  const allTerms = [suggestion.label, ...suggestion.synonyms].filter(Boolean);
  if (allTerms.length === 0) return;

  if (suggestion.type === AutoCompleteType.ORGANIZATION) {
    // Open-ended boundary: matches "Services" when searching "Service"
    const regexTerms = allTerms.map((term) =>
      createOpenEndedWordBoundaryRegex(term)
    );
    nosqlQuery["slugs.infos.name"] = { $in: regexTerms };
  } else {
    const regexTerms = allTerms.map((term) => createWordBoundaryRegex(term));
    nosqlQuery["slugs.infos.name"] = { $in: regexTerms };
  }
}

function buildSimpleSearch(nosqlQuery: any, searchTerm: string): void {
  const tempQuery = { word: "" };
  parseTextSearch(tempQuery, { word: searchTerm }, "word");
  nosqlQuery["slugs.infos.name"] = tempQuery.word;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function findSuggestionBySynonym(
  searchTerm: string,
  lang: SupportedLanguagesCode
): FormattedSuggestion | null {
  const suggestionBySlug = autocompleteSuggestionService.findBySlugAndLang(
    searchTerm,
    lang
  );
  if (suggestionBySlug) {
    return suggestionBySlug;
  }

  return autocompleteSuggestionService.findBySynonym(searchTerm, lang);
}

function createWordBoundaryRegex(term: string): RegExp {
  const escaped = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, String.raw`\$&`);
  return new RegExp(String.raw`\b${escaped}\b`, "i");
}

/**
 * Like createWordBoundaryRegex but without the closing \b, so that
 * plurals work.
 */
function createOpenEndedWordBoundaryRegex(term: string): RegExp {
  const escaped = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, String.raw`\$&`);
  return new RegExp(String.raw`\b${escaped}`, "i");
}
