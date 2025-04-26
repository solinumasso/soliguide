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
  CommonOpeningHours,
  CommonTimeslot,
  OpeningHoursContext,
  PostgresHours,
  DayName,
} from '@soliguide/common';
import { DagsterSchema } from '../../../../config/enums';
import { PostgresService } from '../../postgres.service';
import { HoursHolidaysService } from './hoursHolidays.service';

export class HoursService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getHoursByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<CommonOpeningHours> {
    const connection = this.postgresService.getConnection();

    const hoursHolidaysService = new HoursHolidaysService(this.postgresService);
    const hoursHolidays =
      await hoursHolidaysService.getHoursHolidaysByIdSoliguideFormat(
        id,
        schema,
      );

    let context: OpeningHoursContext;

    if (schema === DagsterSchema.STRUCTURE) {
      context = OpeningHoursContext.PUBLIC;
    }

    const postgresHours = await connection<PostgresHours[]>`
      SELECT *
      FROM ${connection(schema)}.hours
      WHERE id = ${id}
    `;

    const hours = new CommonOpeningHours();

    postgresHours.forEach((postgresHour) => {
      const day = postgresHour.day.toLowerCase() as DayName;
      const timeslot = new CommonTimeslot(
        {
          start: postgresHour.start,
          end: postgresHour.end,
        },
        context,
      );
      if (hours[day]) {
        hours[day]['timeslot'].push(timeslot);
        hours[day]['open'] = true;
      } else {
        hours[day] = {
          timeslot: [timeslot],
          open: true,
        };
      }
    });

    return {
      ...hours,
      ...hoursHolidays,
    };
  }
}
