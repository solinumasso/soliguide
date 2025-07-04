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
import { PostgresPublicsOther, PublicsOther } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PublicsOtherService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPublicsOtherByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<PublicsOther[]> {
    const connection = this.postgresService.getConnection();

    const result = await connection<PostgresPublicsOther[]>`
      SELECT *
      FROM ${connection(schema)}.publics_other
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!result.length) {
      return [];
    }

    const data = result[0];

    return Object.values(PublicsOther).filter(
      (enumValue) =>
        enumValue !== PublicsOther.all && // Exclude "all"
        enumValue in data && // Check if exists
        data[enumValue as keyof PostgresPublicsOther] === true, // Check if it's true
    );
  }
}
