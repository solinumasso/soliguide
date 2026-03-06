import {
  PostgresServiceCompare,
  CommonNewPlaceService,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class CompareService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getCompareByIdSoliguideFormat(
    id: string,
  ): Promise<Partial<CommonNewPlaceService>> {
    const connection = this.postgresService.getConnection();

    const postgresServiceCompare = await connection<PostgresServiceCompare[]>`
      SELECT *
      FROM dagster_service.compare_similarity
      where id = ${id}
    `;

    const formatServiceCompare: Partial<CommonNewPlaceService> = {
      differentHours: !postgresServiceCompare[0].hours,
      differentPublics: !postgresServiceCompare[0].publics,
      differentModalities: !postgresServiceCompare[0].modalities,
    };

    return formatServiceCompare;
  }
}
