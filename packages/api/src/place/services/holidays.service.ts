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
  private holidays: AllPublicHolidays = {};

  constructor() {
    this.lastUpdate = null;
    this.apiBaseUrl = `${CONFIG.SOLIGUIDE_LOCATION_API_URL}holidays/`;

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

    return Object.fromEntries(results);
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
