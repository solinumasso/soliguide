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
import { PostgresPublicsFamily, PublicsFamily } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PublicsFamilyService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPublicsFamilyByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<PublicsFamily[]> {
    const connection = this.postgresService.getConnection();

    const postgresPublicsFamily = await connection<PostgresPublicsFamily[]>`
      SELECT *
      FROM ${connection(schema)}.publics_family
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!postgresPublicsFamily[0]) {
      return [];
    }

    const familyData = postgresPublicsFamily[0];
    return Object.values(PublicsFamily).filter(
      (enumValue) =>
        enumValue !== PublicsFamily.all && // Exclude "all"
        enumValue in familyData && // Check if property exists
        familyData[enumValue as keyof PostgresPublicsFamily] === true, // Check if it's true
    );
  }
}
