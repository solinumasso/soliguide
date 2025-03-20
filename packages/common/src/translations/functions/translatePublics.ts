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
import { SupportedLanguagesCode } from "../enums";
import {
  ALL_PUBLICS,
  PUBLICS_LABELS,
  Publics,
  PublicsAdministrative,
  PublicsFamily,
  PublicsOther,
  WelcomedPublics,
} from "../../publics";
import { capitalize } from "../../general";
import { i18n } from "i18next";
import { I18nTranslator } from "../interfaces";

/**
 * Generates descriptive text for target publics with appropriate prefix
 * @param i18next - i18next translator instance
 * @param lng - Language code
 * @param publics - Publics configuration
 * @param formatAsHtml - Format result with HTML tags (default false)
 * @param addDescription- Include header text (default false)
 */
export const translatePublics = (
  i18next: I18nTranslator,
  lng: SupportedLanguagesCode,
  publics: Publics,
  formatAsHtml = false,
  addDescription = false
): string => {
  // Unconditional welcome case
  if (publics?.accueil === 0) {
    const unconditionalText = i18next.t("PUBLICS_WELCOME_UNCONDITIONAL", {
      lng,
    });

    if (formatAsHtml) {
      return `<b>${unconditionalText}</b>`;
    } else {
      return unconditionalText.replace(/<[^>]*>?/gm, "");
    }
  }

  let headerText = "";
  let detailsText = "";

  // Set header text based on welcome type
  if (publics.accueil === WelcomedPublics.EXCLUSIVE) {
    headerText = `${i18next.t("PUBLICS_WELCOME_EXCLUSIVE", { lng })}: `;
  } else if (publics.accueil === WelcomedPublics.PREFERENTIAL) {
    headerText = `${i18next.t("PUBLICS_WELCOME_PREFERENTIAL", { lng })} `;
  }

  // GENDER
  if (publics.gender.length !== 2) {
    detailsText =
      detailsText +
      (publics.gender[0] === "men"
        ? i18next.t("PUBLICS_GENDER_MEN", { lng })
        : i18next.t("PUBLICS_GENDER_WOMEN", { lng }));
    detailsText = detailsText + ", ";
  }

  // AGE
  if (publics.age.min !== 0 || publics.age.max !== 99) {
    if (publics.age.min === 0 && publics.age.max === 18) {
      detailsText = detailsText + `${i18next.t("PUBLICS_AGE_MINORS", { lng })}`;
    } else if (publics.age.min === 18 && publics.age.max === 99) {
      detailsText = detailsText + `${i18next.t("PUBLICS_AGE_MAJORS", { lng })}`;
    } else if (publics.age.min !== 0 && publics.age.max === 99) {
      detailsText =
        detailsText +
        i18next.t("PUBLICS_AGE_FROM_XX", {
          lng,
          replace: {
            min: publics.age.min,
          },
        });
    } else if (publics.age.min === 0 && publics.age.max !== 99) {
      detailsText =
        detailsText +
        i18next.t("PUBLICS_AGE_TO_XX_MAX", {
          lng,
          replace: {
            max: publics.age.max,
          },
        });
    } else if (publics.age.min === publics.age.max) {
      detailsText =
        detailsText +
        i18next.t("PUBLICS_SPECIFIC_AGE", {
          lng,
          replace: {
            age: publics.age.min,
          },
        });
    } else {
      detailsText =
        detailsText +
        i18next.t("PUBLICS_AGE_RANGE", {
          lng,
          replace: {
            max: publics.age.max,
            min: publics.age.min,
          },
        });
    }
    detailsText = detailsText + ", ";
  }

  // ADMINISTRATIVE
  if (ALL_PUBLICS.administrative.length - 1 !== publics.administrative.length) {
    publics.administrative.forEach((adminPublic: PublicsAdministrative) => {
      detailsText =
        detailsText +
        `${i18next.t(PUBLICS_LABELS.administrative[adminPublic], { lng })}, `;
    });
  }

  // FAMILY
  if (ALL_PUBLICS.familialle.length - 1 !== publics.familialle.length) {
    publics.familialle.forEach((family: PublicsFamily) => {
      detailsText =
        detailsText +
        `${i18next.t(PUBLICS_LABELS.familialle[family], { lng })}, `;
    });
  }

  detailsText = detailsText.toLowerCase();

  // OTHER
  if (
    publics.other.length > 0 &&
    ALL_PUBLICS.other.length - 1 !== publics.other.length
  ) {
    publics.other.forEach((otherPublic: PublicsOther) => {
      detailsText =
        detailsText +
        `${i18next
          .t(PUBLICS_LABELS.other[otherPublic], { lng })
          .toLowerCase()}, `;
    });
  }

  // Add additional description if it exists
  if (addDescription && publics.description) {
    if (formatAsHtml) {
      detailsText = `${detailsText.slice(0, -2)}.<br><b>${i18next.t(
        "INFO_IMPORTANTE",
        { lng }
      )}</b> ${publics.description}<br>`;
    } else {
      detailsText = `${detailsText.slice(0, -2)}.\n${i18next.t(
        "INFO_IMPORTANTE",
        { lng }
      )} ${publics.description}\n`;
    }
  } else {
    detailsText = `${detailsText.slice(0, -2)}.`;
  }

  // Assemble final result
  let result = "";

  if (formatAsHtml) {
    if (headerText?.length > 0) {
      result = `<b>${headerText}</b>${detailsText}`;
    } else {
      result = detailsText;
    }
  } else {
    result = `${headerText}${detailsText}`;
    result = result.replace(/<[^>]*>?/gm, "");
  }

  return capitalize(result).trim();
};

/**
 * Simplified version that returns only the detailed text (without header)
 */
export const translatePublicsDetails = (
  i18next: i18n,
  lng: SupportedLanguagesCode,
  publics: Publics,
  stripTags = true
): string => translatePublics(i18next, lng, publics, stripTags, false);

/**
 * Version that returns only the header text
 */
export const translatePublicsHeader = (
  i18next: i18n,
  lng: SupportedLanguagesCode,
  publics: Publics,
  stripTags = true
): string => {
  if (!publics || publics.accueil === 0) {
    const unconditionalText = i18next.t("PUBLICS_WELCOME_UNCONDITIONAL", {
      lng,
    });
    return stripTags
      ? unconditionalText.replace(/<[^>]*>?/gm, "")
      : unconditionalText;
  }

  if (publics.accueil === WelcomedPublics.EXCLUSIVE) {
    return i18next.t("PUBLICS_WELCOME_EXCLUSIVE", { lng });
  }

  if (publics.accueil === WelcomedPublics.PREFERENTIAL) {
    return i18next.t("PUBLICS_WELCOME_PREFERENTIAL", { lng });
  }

  return "";
};
