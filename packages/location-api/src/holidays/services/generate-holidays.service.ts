
import { Logger } from "@nestjs/common";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  ALL_REGIONS_DEF,
  AllPublicHolidays,
  AnyDepartmentCode,
  PublicHoliday,
  SOLIGUIDE_COUNTRIES,
  SoliguideCountries,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { addYears, endOfYear, format } from "date-fns";
import { Holiday } from "../interfaces/holidays.interface";
import { Cron, CronExpression } from "@nestjs/schedule";

const HOLIDAYS_API_BASE_URL = "https://openholidaysapi.org" as const;
const MAX_RETRIES = 2;
const HOLIDAYS_JSON_PATH = path.resolve(
  __dirname,
  "../../../resources/temp-info-data/public-holidays.json"
);
export class GenerateHolidaysService {
  private readonly logger = new Logger(GenerateHolidaysService.name);

  @Cron(CronExpression.EVERY_6_MONTHS)
  public async createHolidaysFile() {
    this.logger.log("[HOLIDAYS] Create holiday file");

    try {
      const publicHolidaysJson = await this.getPublicHolidaysContent();
      await this.saveData(publicHolidaysJson);
      this.logger.log("[HOLIDAYS] File created successfully");
    } catch (e) {
      this.logger.error(e, "[HOLIDAYS] Failed to manage the holidays file");
      throw e;
    }
  }

  private getHolidaysForCountry = async (
    country: SoliguideCountries
  ): Promise<Holiday[]> => {
    const language =
      SUPPORTED_LANGUAGES_BY_COUNTRY[country].source.toUpperCase();
    const fromDate = format(new Date(), "yyyy-MM-dd");
    const toDate = format(endOfYear(addYears(new Date(), 1)), "yyyy-MM-dd");
    const url = `${HOLIDAYS_API_BASE_URL}/PublicHolidays?countryIsoCode=${country.toUpperCase()}&validFrom=${fromDate}&validTo=${toDate}&languageIsoCode=${language}`;

    // ! country & languageIsoCode must be uppercase for OpenHolidays api
    try {
      const allPublicHolidaysRequest = await fetch(url);
      return allPublicHolidaysRequest.json();
    } catch (e) {
      this.logger.debug(url);
      this.logger.error(e);
      return [];
    }
  };

  private getPublicHolidaysContent = async (): Promise<AllPublicHolidays> => {
    const holidaysNewFormat: AllPublicHolidays = {};
    for (const country of SOLIGUIDE_COUNTRIES) {
      const apiHolidays = await this.getHolidaysForCountry(
        country.toLowerCase() as SoliguideCountries
      );

      holidaysNewFormat[country] = this.processHolidays(
        apiHolidays,
        country.toLowerCase() as SoliguideCountries
      );
    }
    return holidaysNewFormat;
  };

  // Convert postal code / department code / scholar zone in departmentCodes
  public getDepartmentCodeFromOpenHolidays(
    code: string,
    countryCode: SoliguideCountries
  ): AnyDepartmentCode[] {
    const shortCode = code.split("-").pop() || code;

    const regionMatch = ALL_REGIONS_DEF[countryCode].find(
      (region) => region.subdivisionShortName === shortCode
    );

    // 1. Region match: get all departments of this region
    if (regionMatch) {
      return regionMatch.departments
        .map((dept) => dept.departmentCode)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    }

    // 2. Check by department 'subdivisionShortName" which is set by openholidays
    const departmentBySubdivision = ALL_REGIONS_DEF[countryCode]
      .flatMap((region) => region.departments)
      .find((dept) => dept.subdivisionShortName === shortCode);

    if (departmentBySubdivision) {
      return [departmentBySubdivision.departmentCode];
    }

    // 3. Some holidays have department code
    const departmentByCode = ALL_REGIONS_DEF[countryCode]
      .flatMap((region) => region.departments)
      .find((dept) => dept.departmentCode === shortCode);

    if (departmentByCode) {
      return [departmentByCode.departmentCode];
    }

    return [];
  }

  public processHolidays(
    holidays: Holiday[],
    country: SoliguideCountries
  ): PublicHoliday[] {
    if (!holidays.length) {
      return [];
    }
    return holidays.map((holiday) => {
      const holidayName =
        holiday.name.find((n) => n.language === country)?.text ||
        holiday.name[0].text;

      // Keep only translations supported by Soliguide
      const translations: { [key in SupportedLanguagesCode]?: string } = {};

      holiday.name.forEach((translation) => {
        if (
          SUPPORTED_LANGUAGES.includes(
            translation.language.toLowerCase() as SupportedLanguagesCode
          )
        ) {
          translations[
            translation.language.toLowerCase() as SupportedLanguagesCode
          ] = translation.text;
        }
      });

      const departments =
        !holiday.nationwide && holiday.subdivisions
          ? Array.from(
              new Set(
                holiday.subdivisions.flatMap((sub) =>
                  this.getDepartmentCodeFromOpenHolidays(sub.code, country)
                )
              )
            ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          : [];

      return {
        isNational: holiday.nationwide,
        name: holidayName,
        departments,
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        translations,
      };
    });
  }

  private saveData = async (data: AllPublicHolidays) => {
    await mkdir(path.dirname(HOLIDAYS_JSON_PATH), { recursive: true });
    await writeFile(HOLIDAYS_JSON_PATH, JSON.stringify(data, null, 2));
  };

  public readHolidaysFile = async (
    retryCount = 0
  ): Promise<AllPublicHolidays> => {
    try {
      const fileContent = await readFile(HOLIDAYS_JSON_PATH, "utf-8");
      return JSON.parse(fileContent);
    } catch (e) {
      this.logger.error(
        `Failed to read holidays file (attempt ${
          retryCount + 1
        }/${MAX_RETRIES})`,
        e
      );

      if (retryCount < MAX_RETRIES) {
        await this.createHolidaysFile();
        return this.readHolidaysFile(retryCount + 1);
      }

      this.logger.error(
        `Max retries (${MAX_RETRIES}) reached. Cannot read holiday file.`
      );
      throw new Error("CANNOT READ HOLIDAY FILE AFTER MAX RETRIES");
    }
  };
}
