import {
  CommonOpeningHours,
  PlaceClosedHolidays,
  PostgresHoursHolidays,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class HoursHolidaysService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getHoursHolidaysByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<Pick<CommonOpeningHours, 'closedHolidays' | 'description'>> {
    const connection = this.postgresService.getConnection();

    const postgresHours = await connection<PostgresHoursHolidays[]>`
      SELECT *
      FROM ${connection(schema)}.hours_holidays
      WHERE id = ${id}
    `;

    if (!postgresHours.length) {
      return {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: '',
      };
    }

    return {
      closedHolidays: postgresHours[0].holidays,
      description: postgresHours[0].description,
    };
  }
}
