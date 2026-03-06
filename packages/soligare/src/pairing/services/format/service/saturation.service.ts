import {
  PostgresServiceSaturation,
  CommonNewPlaceService,
  ServiceSaturation,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class SaturationService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getSaturationByIdSoliguideFormat(
    id: string,
  ): Promise<Pick<CommonNewPlaceService, 'saturated'>> {
    const connection = this.postgresService.getConnection();

    const postgresServiceSaturation = await connection<
      PostgresServiceSaturation[]
    >`
      SELECT *
      FROM dagster_service.saturation
      where id = ${id}
    `;

    if (!postgresServiceSaturation.length) {
      return {
        saturated: {
          status: ServiceSaturation.LOW,
          precision: null,
        },
      };
    }

    const formatServiceSaturation: Pick<CommonNewPlaceService, 'saturated'> = {
      saturated: {
        status: postgresServiceSaturation[0].status as ServiceSaturation,
        precision: postgresServiceSaturation[0].precision,
      },
    };

    return formatServiceSaturation;
  }
}
