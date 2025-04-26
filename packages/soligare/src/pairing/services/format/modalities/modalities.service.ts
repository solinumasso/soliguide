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
