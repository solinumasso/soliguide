import { SearchSuggestion } from "../auto-complete";

export type FormattedSuggestion = Pick<
  SearchSuggestion,
  | "categoryId"
  | "label"
  | "slug"
  | "synonyms"
  | "type"
  | "lang"
  | "country"
  | "seoTitle"
  | "seoDescription"
>;
