import { PostgresModalitiesPrecisions } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class ModalitiesPrecisionsService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getModalitiesPrecisionsByIdSoliguideFormat(
    id: string,
    schema: string,
  ) {
    const connection = this.postgresService.getConnection();

    const postgresModalitiesPrecisions = await connection<
      PostgresModalitiesPrecisions[]
    >`
      SELECT *
      FROM ${connection(schema)}.modalities_precisions
      WHERE id = ${id}
    `;

    const formatModalitiesPrecisions = {
      appointment: postgresModalitiesPrecisions[0].appointment,
      inscription: postgresModalitiesPrecisions[0].membership,
      orientation: postgresModalitiesPrecisions[0].orientation,
      price: postgresModalitiesPrecisions[0].price,
    };

    return formatModalitiesPrecisions;
  }
}
