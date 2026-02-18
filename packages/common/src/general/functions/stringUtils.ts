import slug from "slug";
import striptags from "striptags";
import { decode } from "html-entities";

import { WEEK_DAYS } from "../../dates";
import { SupportedLanguagesCode } from "../../translations";

const DEFAULT_SLUG_OPTIONS = {
  ...slug.defaults.modes.rfc3986,
  mode: "rfc3986" as const,
  locale: SupportedLanguagesCode.FR,
} as const;

const COMMON_CHARMAP_OVERRIDES = {
  ...slug.charmap,
  "/": " ",
  "'": " ",
  "\u2019": " ", // '
  "°": " ",
  ".": " ",
} as const;

// Unicode NFD normalization: décompose puis supprime les diacritiques
export const removeAccents = (src: string): string =>
  src
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .split("")
    .map((char) => (char in slug.charmap ? slug.charmap[char] : char))
    .join("");

const sanitize = (str: string): string => {
  const decoded = decode(str || "", { level: "html5" });
  return striptags(decoded);
};

const buildSlug = (
  str: string,
  replacement: string,
  language?: SupportedLanguagesCode,
  charmapOverrides?: Record<string, string>
): string =>
  slug(sanitize(str), {
    ...DEFAULT_SLUG_OPTIONS,
    replacement,
    locale: language ?? DEFAULT_SLUG_OPTIONS.locale,
    charmap: {
      ...COMMON_CHARMAP_OVERRIDES,
      "-": replacement,
      ...charmapOverrides,
    },
  });

export const slugString = (
  str: string,
  language?: SupportedLanguagesCode
): string => buildSlug(str, " ", language);

export const getSeoSlug = (
  str: string,
  language?: SupportedLanguagesCode
): string => buildSlug(str, "-", language);

export const slugLocation = (str: string | null): string => {
  if (!str) return "";

  return slug(str.replaceAll(/, france$/gi, ""), {
    ...DEFAULT_SLUG_OPTIONS,
    charmap: {
      ...slug.charmap,
      "'": "-",
      "\u2019": "-", // '
    },
  });
};

export const capitalize = (value: number | string): string => {
  if (!value) return "";

  let result = String(value);
  result = result.charAt(0).toUpperCase() + result.slice(1);

  for (const day of WEEK_DAYS) {
    const index = result.indexOf(day);
    if (index !== -1) {
      result =
        result.slice(0, index) +
        result.charAt(index).toUpperCase() +
        result.slice(index + 1);
    }
  }

  return result;
};
