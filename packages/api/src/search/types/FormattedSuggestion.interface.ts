import { SearchSuggestion } from "@soliguide/common";

export type FormattedSuggestion = Pick<
  SearchSuggestion,
  | "categoryId"
  | "label"
  | "slug"
  | "synonyms"
  | "type"
  | "seoTitle"
  | "seoDescription"
>;
