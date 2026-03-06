import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import type { i18n } from "i18next";

import { capitalize } from "../../general";
import { SupportedLanguagesCode } from "../enums";

export const translateDateInterval = (
  i18next: i18n,
  lng: SupportedLanguagesCode,
  givenStartDate: Date | string | null,
  givenEndDate: Date | string | null
): string => {
  let translatedMessage = "";
  if (!givenStartDate) {
    return "";
  }

  if (typeof givenStartDate === "string") {
    givenStartDate = new Date(givenStartDate);
  }

  const startDate = formatInTimeZone(givenStartDate, "Etc/GMT", "dd/MM/yyyy");

  if (!givenEndDate) {
    const word =
      differenceInCalendarDays(givenStartDate, new Date()) <= 0
        ? "DATE_INTERVAL_FROM_PAST"
        : "DATE_INTERVAL_FROM_FUTURE";

    translatedMessage = i18next.t(word, {
      interpolation: { escapeValue: false },
      lng,
      replace: {
        startDate,
      },
    });
    return capitalize(translatedMessage);
  }

  if (typeof givenEndDate === "string") {
    givenEndDate = new Date(givenEndDate);
  }

  // Mongo saves dates in UTC. New Date() and "format" return date in local timezone (Europe/Paris) +02 or +01
  const endDate = formatInTimeZone(givenEndDate, "Etc/GMT", "dd/MM/yyyy");

  if (differenceInCalendarDays(givenStartDate, givenEndDate) !== 0) {
    translatedMessage = i18next.t("DATE_INTERVAL_FROM_TO", {
      interpolation: { escapeValue: false },
      lng,
      replace: {
        endDate,
        startDate,
      },
    });

    return capitalize(translatedMessage);
  }

  translatedMessage = i18next.t("DATE_INTERVAL_THE_DAY", {
    interpolation: { escapeValue: false },
    lng,
    replace: {
      startDate,
    },
  });

  return capitalize(translatedMessage);
};
