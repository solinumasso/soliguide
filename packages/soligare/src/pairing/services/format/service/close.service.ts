import { PostgresServiceClose, CommonNewPlaceService } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class CloseService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getCloseByIdSoliguideFormat(
    id: string,
  ): Promise<Partial<CommonNewPlaceService>> {
    const connection = this.postgresService.getConnection();

    const postgresServiceClose = await connection<PostgresServiceClose[]>`
      SELECT *
      FROM dagster_service.close
      where id = ${id}
    `;

    if (!postgresServiceClose.length) {
      return {
        close: {
          actif: false,
          dateDebut: null,
          dateFin: null,
        },
      };
    }

    const formatServiceClose: Partial<CommonNewPlaceService> = {
      close: {
        actif: postgresServiceClose[0].alive,
        dateDebut: postgresServiceClose[0].start,
        dateFin: postgresServiceClose[0].end,
      },
    };

    return formatServiceClose;
  }
}
