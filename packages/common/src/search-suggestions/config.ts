export const FUSE_SEARCH_SUGGESTIONS_OPTIONS = {
  isCaseSensitive: false,
  ignoreDiacritics: true,
  includeScore: true,
  includeMatches: false,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: false,
  keys: [
    { name: "label" as const, weight: 10 },
    { name: "synonyms" as const, weight: 1 },
  ],
  location: 0,
  threshold: 0.1,
  distance: 100,
  ignoreLocation: true,
  useExtendedSearch: false,
  ignoreFieldNorm: true,
};
