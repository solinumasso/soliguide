import { Modalities, PostgresModalities } from '@soliguide/common';
import { ModalitiesPrecisionsService } from './precisions.service';
import { PostgresService } from '../../postgres.service';

export class ModalitiesService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getModalitiesByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<Modalities> {
    const connection = this.postgresService.getConnection();

    const modalitiesPrecisionsService = new ModalitiesPrecisionsService(
      this.postgresService,
    );
    const modalitiesPrecisions =
      await modalitiesPrecisionsService.getModalitiesPrecisionsByIdSoliguideFormat(
        id,
        schema,
      );

    const postgresModalities = await connection<PostgresModalities[]>`
      SELECT *
      FROM ${connection(schema)}.modalities
      WHERE id = ${id}
    `;

    const preFormatModalities: Partial<Modalities> = {
      inconditionnel: postgresModalities[0].unconditional,
      appointment: {
        checked: postgresModalities[0].appointment,
        precisions: modalitiesPrecisions.appointment,
      },
      inscription: {
        checked: postgresModalities[0].membership,
        precisions: modalitiesPrecisions.inscription,
      },
      orientation: {
        checked: postgresModalities[0].orientation,
        precisions: modalitiesPrecisions.orientation,
      },
      price: {
        checked: postgresModalities[0].price,
        precisions: modalitiesPrecisions.price,
      },
      animal: {
        checked: postgresModalities[0].animal,
      },
      pmr: {
        checked: postgresModalities[0].prm,
      },
      other: postgresModalities[0].other,
    };

    return new Modalities(preFormatModalities);
  }
}
