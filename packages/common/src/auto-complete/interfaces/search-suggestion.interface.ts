import { Categories } from "../../categories";
import { SoliguideCountries } from "../../location";
import { SupportedLanguagesCode } from "../../translations";
import { AutoCompleteType } from "../enums";

export interface SearchSuggestion {
  sourceId: string;
  lang: SupportedLanguagesCode;
  label: string;
  categoryId: Categories | null;
  slug: string;
  country: SoliguideCountries;
  synonyms: string[];
  type: AutoCompleteType;
  content: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}
