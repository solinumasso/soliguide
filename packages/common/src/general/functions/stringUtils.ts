/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import slug from "slug";
import striptags from "striptags";
import { decode } from "html-entities";

import { WEEK_DAYS } from "../../dates";
import { SupportedLanguagesCode } from "../../translations";

export const defaultSlugOptions = {
  ...slug.defaults.modes.rfc3986,
  mode: "rfc3986" as const,
  locale: SupportedLanguagesCode.FR,
};

export const removeAccents = (src: string): string => {
  return src
    .split("")
    .map((char) => {
      if (char in slug.charmap) {
        return slug.charmap[char];
      }
      return char;
    })
    .join("");
};

export const slugString = (
  str: string,
  language?: SupportedLanguagesCode
): string => {
  if (!str) {
    str = "";
  }
  const locale = language ?? defaultSlugOptions.locale;
  let result = decode(str, { level: "html5" });
  result = striptags(result);
  return slug(result, {
    ...defaultSlugOptions,
    replacement: " ",
    locale,
    charmap: {
      ...slug.charmap,
      "-": " ",
      "/": " ",
      "’": " ",
      "'": " ",
      "°": " ",
      ".": " ",
    },
  });
};

export const getSeoSlug = (
  str: string,
  language?: SupportedLanguagesCode
): string => {
  if (!str) {
    str = "";
  }
  const locale = language ?? defaultSlugOptions.locale;
  let result = decode(str, { level: "html5" });
  result = striptags(result);
  return slug(result, {
    ...defaultSlugOptions,
    replacement: "-",
    locale,
    charmap: {
      ...slug.charmap,
      "-": "-",
      "/": " ",
      "’": " ",
      "'": " ",
      "°": " ",
      ".": " ",
    },
  });
};

export const slugLocation = (str: string | null): string => {
  if (!str) {
    return "";
  }
  const result = str.replace(/, france$/gi, "");
  return slug(result, {
    ...defaultSlugOptions,
    charmap: {
      ...slug.charmap,
      "’": "-",
      "'": "-",
    },
  });
};

export const capitalize = (value: number | string): string => {
  let capitalizedValue = value
    ? value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
    : "";

  if (capitalizedValue) {
    for (const day of WEEK_DAYS) {
      if (capitalizedValue.includes(day)) {
        const index = capitalizedValue.indexOf(day);
        capitalizedValue =
          capitalizedValue.slice(0, index) +
          capitalizedValue.charAt(index).toUpperCase() +
          capitalizedValue.slice(index + 1);
      }
    }
  }

  return capitalizedValue;
};
