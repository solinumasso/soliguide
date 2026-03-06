import { CommonPlacePosition, PostgresPosition } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PositionService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPositionByIdSoliguideFormat(
    id: string,
  ): Promise<CommonPlacePosition> {
    const connection = this.postgresService.getConnection();

    const postgresPosition = await connection<PostgresPosition[]>`
      SELECT *
      FROM dagster_structure.positions
      WHERE id = ${id}
    `;

    const preFormatPosition: Partial<CommonPlacePosition> = {
      address: `${postgresPosition[0].address}, ${postgresPosition[0].postal_code} ${postgresPosition[0].city}`,
      additionalInformation: postgresPosition[0].additional_information,
      city: postgresPosition[0].city,
      cityCode: postgresPosition[0].city_code,
      postalCode: postgresPosition[0].postal_code,
      department: postgresPosition[0].department,
      departmentCode: postgresPosition[0].department_code,
      region: postgresPosition[0].region,
      regionCode: postgresPosition[0].region_code,
      country: postgresPosition[0].country,
      timeZone: postgresPosition[0].time_zone,
      location: {
        type: 'Point',
        coordinates: [
          postgresPosition[0].longitude,
          postgresPosition[0].latitude,
        ],
      },
    };

    return new CommonPlacePosition(preFormatPosition);
  }
}
