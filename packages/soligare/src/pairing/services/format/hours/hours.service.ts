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
