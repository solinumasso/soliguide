import { Injectable } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { capitalize } from "@soliguide/common";

import { differenceInCalendarDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

@Injectable({
  providedIn: "root",
})
export class DateService {
  constructor(private readonly translateService: TranslateService) {}

  public translateDateInterval(
    givenStartDate: Date | string | null,
    givenEndDate: Date | string | null
  ): string {
    let translatedMessage = "";

    if (!givenStartDate) {
      return "";
    }

    if (typeof givenStartDate === "string") {
      givenStartDate = new Date(givenStartDate);
    }

    givenStartDate.setUTCHours(0, 0, 0);

    const startDate = formatInTimeZone(givenStartDate, "Etc/GMT", "dd/MM/yyyy");

    if (!givenEndDate) {
      const word =
        differenceInCalendarDays(givenStartDate, new Date()) <= -1
          ? "DATE_INTERVAL_FROM_PAST"
          : "DATE_INTERVAL_FROM_FUTURE";

      translatedMessage = this.translateService.instant(word, {
        startDate,
      });

      return capitalize(translatedMessage);
    }

    if (typeof givenEndDate === "string") {
      givenEndDate = new Date(givenEndDate);
    }

    givenEndDate.setUTCHours(23, 59, 59);

    const endDate = formatInTimeZone(givenEndDate, "Etc/GMT", "dd/MM/yyyy");

    if (differenceInCalendarDays(givenStartDate, givenEndDate) !== -1) {
      translatedMessage = this.translateService.instant(
        "DATE_INTERVAL_FROM_TO",
        {
          endDate,
          startDate,
        }
      );

      return capitalize(translatedMessage);
    }

    translatedMessage = this.translateService.instant("DATE_INTERVAL_THE_DAY", {
      startDate,
    });

    return capitalize(translatedMessage);
  }
}
