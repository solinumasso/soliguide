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
import { PostgresPublics, Publics } from '@soliguide/common';
import { PublicsAdministrativeService } from './administrative.service';
import { PublicsFamilyService } from './family.service';
import { PublicsOtherService } from './other.service';
import { PublicsGenderService } from './gender.service';
import { PostgresService } from '../../postgres.service';

export class PublicsService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPublicsByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<Publics> {
    const connection = this.postgresService.getConnection();

    const publicsAdministrativeService = new PublicsAdministrativeService(
      this.postgresService,
    );
    const publicsAdministrative =
      await publicsAdministrativeService.getPublicsAdministrativeByIdSoliguideFormat(
        id,
        schema,
      );
    const publicsFamilyService = new PublicsFamilyService(this.postgresService);
    const publicsFamily =
      await publicsFamilyService.getPublicsFamilyByIdSoliguideFormat(
        id,
        schema,
      );
    const publicsGenderService = new PublicsGenderService(this.postgresService);
    const publicsGender =
      await publicsGenderService.getPublicsGenderByIdSoliguideFormat(
        id,
        schema,
      );
    const publicsOtherService = new PublicsOtherService(this.postgresService);
    const publicsOther =
      await publicsOtherService.getPublicsOtherByIdSoliguideFormat(id, schema);

    const postgresPublics = await connection<PostgresPublics[]>`
      SELECT *
      FROM ${connection(schema)}.publics
      WHERE id = ${id}
    `;

    const preFormatPublics: Partial<Publics> = {
      accueil: postgresPublics[0].reception,
      description: postgresPublics[0].description,
      showAge: postgresPublics[0].show_age,
      age: { max: postgresPublics[0].age_max, min: postgresPublics[0].age_min },
      administrative: publicsAdministrative,
      familialle: publicsFamily,
      gender: publicsGender,
      other: publicsOther,
    };

    return new Publics(preFormatPublics);
  }
}
