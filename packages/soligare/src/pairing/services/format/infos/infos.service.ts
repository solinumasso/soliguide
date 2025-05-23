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
import { ApiPlace, PostgresInfos } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';
import { EntityService } from './entity.service';

export class InfosService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getInfosByIdSoliguideFormat(
    id: string,
  ): Promise<Pick<ApiPlace, 'name' | 'description' | 'entity'>> {
    const connection = this.postgresService.getConnection();

    const entityService = new EntityService(this.postgresService);
    const entity = await entityService.getEntityByIdSoliguideFormat(id);

    const postgresInfos = await connection<PostgresInfos[]>`
      SELECT *
      FROM dagster_structure.infos
      WHERE id = ${id}
    `;

    const formatInfos = {
      name: postgresInfos[0].name,
      description: postgresInfos[0].description,
      entity,
    };

    return formatInfos;
  }
}
