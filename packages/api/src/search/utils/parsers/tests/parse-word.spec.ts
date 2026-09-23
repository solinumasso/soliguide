import { slugString } from "@soliguide/common";

import { searchSuggestionsService } from "../../../../search-suggestions";
import { buildEnhancedWordSearch } from "../parse-word";

// Place names are indexed through slugString: lowercase, accents removed, hyphens turned into spaces
const CROIX_ROUGE_INDEXED_NAME = slugString(
  "Croix-Rouge française - Unite Locale de Paris xv"
);

const matchesIndexedName = (nosqlQuery: any, indexedName: string): boolean => {
  const condition = nosqlQuery["slugs.infos.name"];

  if (condition?.$in) {
    return condition.$in.some((regex: RegExp) => regex.test(indexedName));
  }

  return new RegExp(condition.$regex, condition.$options).test(indexedName);
};

const buildQueryForWord = (word: string): any => {
  const nosqlQuery: any = {};
  // The search DTO always slugifies the incoming word before it reaches the parser
  buildEnhancedWordSearch({ word: slugString(word) }, nosqlQuery);
  return nosqlQuery;
};

describe("buildEnhancedWordSearch", () => {
  beforeAll(() => {
    searchSuggestionsService.initialize();
  });

  it("should leave the query untouched when no word is searched", () => {
    const nosqlQuery: any = {};

    buildEnhancedWordSearch({ word: "" }, nosqlQuery);

    expect(nosqlQuery).toEqual({});
  });

  it("should expand a known suggestion into its label and synonyms", () => {
    const nosqlQuery = buildQueryForWord("croix-rouge");

    expect(nosqlQuery["slugs.infos.name"].$in.length).toBeGreaterThan(1);
  });

  it("should match a place name indexed with slugString from an accented suggestion", () => {
    const nosqlQuery = buildQueryForWord("croix-rouge");

    expect(matchesIndexedName(nosqlQuery, CROIX_ROUGE_INDEXED_NAME)).toBe(true);
  });

  it("should match the same places whichever synonym is searched", () => {
    const nosqlQuery = buildQueryForWord("croix rouge française");

    expect(matchesIndexedName(nosqlQuery, CROIX_ROUGE_INDEXED_NAME)).toBe(true);
  });

  it("should only match whole words", () => {
    const nosqlQuery = buildQueryForWord("croix-rouge");

    expect(
      matchesIndexedName(nosqlQuery, slugString("Association Croixrouge"))
    ).toBe(false);
  });

  it("should fall back to a substring search when no suggestion matches", () => {
    const nosqlQuery = buildQueryForWord("maraude de nuit");

    expect(nosqlQuery["slugs.infos.name"].$in).toBeUndefined();
    expect(
      matchesIndexedName(nosqlQuery, slugString("Maraude de nuit du secteur"))
    ).toBe(true);
  });
});
