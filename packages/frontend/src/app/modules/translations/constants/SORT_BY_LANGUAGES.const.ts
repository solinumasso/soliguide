import { SupportedLanguagesCode } from "@soliguide/common";

import {
  SearchTranslatedFieldsSortBy,
  SearchTranslatedPlaceSortBy,
} from "../types";

export const SORT_BY_LANGUAGES: {
  [key in SupportedLanguagesCode]: SearchTranslatedFieldsSortBy;
} = {
  ar: "languages.ar.human.status",
  ca: "languages.ca.human.status",
  en: "languages.en.human.status",
  fa: "languages.fa.human.status",
  ka: "languages.ka.human.status",
  es: "languages.es.human.status",
  ps: "languages.ps.human.status",
  pt: "languages.pt.human.status",
  ro: "languages.ro.human.status",
  ru: "languages.ru.human.status",
  uk: "languages.uk.human.status",
  fr: "languages.fr.human.status",
};

export const SORT_BY_LANGUAGES_RATE: {
  [key in SupportedLanguagesCode]: SearchTranslatedPlaceSortBy;
} = {
  fr: "languages.fr.translationRate",
  ar: "languages.ar.translationRate",
  ca: "languages.ca.translationRate",
  en: "languages.en.translationRate",
  fa: "languages.fa.translationRate",
  ka: "languages.ka.translationRate",
  es: "languages.es.translationRate",
  ps: "languages.ps.translationRate",
  pt: "languages.pt.translationRate",
  ro: "languages.ru.translationRate",
  ru: "languages.ru.translationRate",
  uk: "languages.uk.translationRate",
};
