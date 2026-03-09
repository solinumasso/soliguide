import { Injectable, OnModuleInit } from "@nestjs/common";
import { isWithinInterval, parseISO } from "date-fns";

import {
  getDepartmentCodeFromPostalCode,
  type SoliguideCountries,
  PublicHoliday,
  AllPublicHolidays,
} from "@soliguide/common";
import { GenerateHolidaysService } from "./generate-holidays.service";

@Injectable()
export class PublicHolidaysService implements OnModuleInit {
  private publicHolidays: AllPublicHolidays = {};

  constructor(
    private readonly generateHolidaysService: GenerateHolidaysService
  ) {}

  async onModuleInit() {
    this.publicHolidays = await this.generateHolidaysService.readHolidaysFile();
  }

  public getPublicHolidaysByDate = (
    country: SoliguideCountries,
    date: Date,
    postalCode?: string
  ): PublicHoliday[] => {
    const countryPublicHolidays = this.publicHolidays[country];

    const holidaysInDateRange = countryPublicHolidays.filter((holiday) =>
      isWithinInterval(date, {
        start: parseISO(holiday.startDate),
        end: parseISO(holiday.endDate),
      })
    );

    if (holidaysInDateRange.length === 0) {
      return [];
    }

    if (postalCode?.length) {
      // Postal Code not set: we keep only national holidays
      const departmentCode = getDepartmentCodeFromPostalCode(
        country,
        postalCode
      );
      if (!departmentCode) {
        throw new Error("PostalCode error");
      }

      return holidaysInDateRange.filter(
        (holiday) =>
          holiday.isNational || holiday.departments.includes(departmentCode)
      );
    }

    return holidaysInDateRange;
  };
}
