import type { FormattedSuggestion } from "./types";

export interface FuseSearchSuggestionsOptions {
  isCaseSensitive: boolean;
  ignoreDiacritics: boolean;
  includeScore: boolean;
  includeMatches: boolean;
  minMatchCharLength: number;
  shouldSort: boolean;
  findAllMatches: boolean;
  keys: { name: keyof FormattedSuggestion; weight: number }[];
  location: number;
  threshold: number;
  distance: number;
  ignoreLocation: boolean;
  useExtendedSearch: boolean;
  ignoreFieldNorm: boolean;
}

export const FUSE_SEARCH_SUGGESTIONS_OPTIONS: FuseSearchSuggestionsOptions = {
  isCaseSensitive: false,
  ignoreDiacritics: true,
  includeScore: true,
  includeMatches: false,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: false,
  keys: [
    { name: "label", weight: 10 },
    { name: "synonyms", weight: 1 },
  ],
  location: 0,
  threshold: 0.1,
  distance: 100,
  ignoreLocation: true,
  useExtendedSearch: false,
  ignoreFieldNorm: true,
};
