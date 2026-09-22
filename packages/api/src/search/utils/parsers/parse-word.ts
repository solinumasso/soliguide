import {
  CountryCodes,
  slugString,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import {
  searchSuggestionsService,
  FormattedSuggestion,
} from "../../../search-suggestions";
import { parseTextSearch } from "./parse-text-search";

export function buildEnhancedWordSearch(
  searchData: any,
  nosqlQuery: any,
  lang: SupportedLanguagesCode = SupportedLanguagesCode.FR,
  country: SoliguideCountries = CountryCodes.FR
): void {
  if (!searchData?.word) {
    return;
  }

  const searchTerm = searchData.word;
  const foundSuggestion = findSuggestionBySynonym(searchTerm, lang, country);

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
  // Terms are matched against slugs.infos.name, which is built with slugString:
  // they must go through the same normalisation or an accent or a hyphen in the
  // suggestion makes the term unmatchable
  const regexTerms = [suggestion.label, ...suggestion.synonyms]
    .filter(Boolean)
    .map((term) => slugString(term))
    .filter(Boolean)
    .map((term) => createWordBoundaryRegex(term));

  if (regexTerms.length > 0) {
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
  lang: SupportedLanguagesCode,
  country: SoliguideCountries = CountryCodes.FR
): FormattedSuggestion | null {
  const suggestionBySlug = searchSuggestionsService.findBySlugAndLang(
    searchTerm,
    lang,
    country
  );
  if (suggestionBySlug) {
    return suggestionBySlug;
  }

  return searchSuggestionsService.findBySynonym(searchTerm, lang, country);
}

function createWordBoundaryRegex(term: string): RegExp {
  const escaped = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, String.raw`\$&`);
  return new RegExp(String.raw`\b${escaped}\b`, "i");
}
