import {
  AllPublicHolidays,
  ApiPlace,
  CountryCodes,
  filterDepartmentsForHolidays,
  PublicHoliday,
  SOLIGUIDE_COUNTRIES,
  SoliguideCountries,
} from "@soliguide/common";
import axios from "axios";
import { format, isSameDay } from "date-fns";
import { AXIOS_CONFIG, CONFIG } from "../../_models";
import { logger } from "../../general/logger";

export class HolidaysService {
  private readonly apiBaseUrl: string;
  private lastUpdate: Date | null;
  private readonly holidays: AllPublicHolidays = {};

  constructor() {
    this.lastUpdate = null;
    this.apiBaseUrl = `${CONFIG.SOLIGUIDE_LOCATION_API_URL}/holidays/`;

    if (CONFIG.ENV === "test") {
      this.lastUpdate = new Date();
      this.holidays = {
        [CountryCodes.FR]: [],
        [CountryCodes.ES]: [],
        [CountryCodes.AD]: [],
      };
    }
  }

  async isDayHolidayForPostalCode(
    place: Pick<ApiPlace, "position" | "parcours" | "placeType" | "country">
  ): Promise<boolean> {
    const holidays = await this.getHolidaysByCountry(place.country);
    return (
      filterDepartmentsForHolidays({
        holidays,
        place,
      })?.length > 0
    );
  }

  async fetchHolidaysForCountries(
    date: Date = new Date()
  ): Promise<{ [country in SoliguideCountries]: PublicHoliday[] }> {
    logger.info(`[HOLIDAYS] - Fetch Holidays for today ${date.toString()}`);

    const formattedDate = format(date, "yyyy-MM-dd");

    const results = await Promise.all(
      SOLIGUIDE_COUNTRIES.map(async (country: CountryCodes) => {
        try {
          this.lastUpdate = new Date();
          const { data } = await axios.get<PublicHoliday[]>(
            `${this.apiBaseUrl}${country}/${formattedDate}`,
            { ...AXIOS_CONFIG }
          );
          return [country, data];
        } catch (error) {
          logger.error(`Failed to fetch holidays for ${country}:`, error);
          return [country, []];
        }
      })
    );

    const fetched = Object.fromEntries(results);
    Object.assign(this.holidays, fetched);
    return fetched;
  }

  public async getHolidaysByCountry(
    country: SoliguideCountries,
    today: Date = new Date()
  ): Promise<PublicHoliday[]> {
    try {
      if (this.lastUpdate && isSameDay(this.lastUpdate, today)) {
        return this.holidays[country] ?? [];
      }

      // Reload holidays
      await this.fetchHolidaysForCountries();

      return this.holidays[country] ?? [];
    } catch (error) {
      logger.error("Cannot get public holidays:", error);
      return [];
    }
  }
}

export default new HolidaysService();
