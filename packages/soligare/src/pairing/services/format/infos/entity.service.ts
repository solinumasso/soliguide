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
import { PostgresEntity, CommonPlaceEntity } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';
import { PhoneService } from './phone.service';

export class EntityService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getEntityByIdSoliguideFormat(
    id: string,
  ): Promise<CommonPlaceEntity> {
    const connection = this.postgresService.getConnection();

    const phoneService = new PhoneService(this.postgresService);
    const phones = await phoneService.getPhoneByIdSoliguideFormat(id);

    const postgresEntity = await connection<PostgresEntity[]>`
      SELECT *
      FROM dagster_structure.entity
      where id = ${id}
    `;

    const formatEntity: CommonPlaceEntity = {
      phones,
      facebook: postgresEntity[0].facebook,
      fax: postgresEntity[0].fax,
      instagram: postgresEntity[0].instagram,
      mail: postgresEntity[0].email,
      name: postgresEntity[0].name,
      website: postgresEntity[0].website,
    };

    return formatEntity;
  }
}
