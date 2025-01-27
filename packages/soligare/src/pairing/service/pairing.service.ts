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
import { Injectable } from '@nestjs/common';
import { AnyDepartmentCode, ExternalStructure } from '@soliguide/common';
import { PostgresService } from './postgres.service';
import { StructureToPairDto } from '../dto/source';

@Injectable()
export class PairingService {
  constructor(private readonly postgresService: PostgresService) {}

  public getStructureToPair(
    structureToPairDto: StructureToPairDto,
  ): Promise<ExternalStructure[]> {
    const connection = this.postgresService.getConnection();
    const offset =
      (structureToPairDto.options.page - 1) *
      (structureToPairDto.options?.limit ?? 10);

    const prefixQuery = connection`
      select
        src.id,
        src.name as source_name,
        inf.name as structure_name,
        pos.latitude,
        pos.longitude,
        concat(pos.address, ', ', pos.postal_code, ' ', pos.city) as address,
        pos.city,
        pos.postal_code,
        pos.country,
        pos.department,
        pos.department_code
      from
        dagster_structure.sources as src
      inner join
        dagster_structure.infos as inf
      on
        src.id=inf.id
      inner join
        dagster_structure.positions as pos
      on
        src.id=pos.id
      inner join
        dagster_structure.ids as i
      on
        src.id=i.id
      where
        i.soliguide_id is null
      and
        src.is_origin is false
    `;

    // There is definitely a better way than this, it's horrible, I hate it
    if (structureToPairDto?.territories) {
      if (structureToPairDto?.sources) {
        return connection<ExternalStructure[]>`
          ${prefixQuery}
          and
            pos.department_code = ANY (${structureToPairDto.territories}::text[])
          and
            src.name = ANY (${structureToPairDto.sources}::text[])
          order by
            pos.latitude, pos.longitude
          limit ${structureToPairDto.options.limit} offset ${offset}
        `;
      }
      return connection<ExternalStructure[]>`
        ${prefixQuery}
        and
          pos.department_code = ANY (${structureToPairDto.territories}::text[])
        order by
          pos.latitude, pos.longitude
        limit ${structureToPairDto.options.limit} offset ${offset}
      `;
    } else if (structureToPairDto.sources) {
      return connection<ExternalStructure[]>`
        ${prefixQuery}
        and
          src.name = ANY (${structureToPairDto.sources}::text[])
        order by
          pos.latitude, pos.longitude
        limit ${structureToPairDto.options.limit} offset ${offset}
      `;
    }
    return connection<ExternalStructure[]>`
      ${prefixQuery}
      order by
        pos.latitude, pos.longitude
      limit ${structureToPairDto.options.limit} offset ${offset}
    `;
  }

  public async countStructureToPair(
    sources?: string[],
    territories?: AnyDepartmentCode[],
  ): Promise<number> {
    const connection = this.postgresService.getConnection();

    const prefixQuery = connection`
      select
        count(src.id)
      from
        dagster_structure.sources as src
      inner join
        dagster_structure.positions as pos
      on
        src.id=pos.id
      inner join
        dagster_structure.ids as i
      on
        src.id=i.id
      where
        i.soliguide_id is null
      and
        src.is_origin is false
    `;

    if (sources) {
      if (territories) {
        const nbresults = await connection`
          ${prefixQuery}
          and
            src.name = ANY (${sources}::text[])
          and
            pos.department_code = ANY (${territories}::text[])
          `;
        return parseInt(nbresults[0].count, 10);
      }
      const nbresults = await connection`
        ${prefixQuery}
        and
          src.name = ANY (${sources}::text[])
        `;
      return parseInt(nbresults[0].count, 10);
    } else if (territories) {
      const nbresults = await connection`
        ${prefixQuery}
        and
          pos.department_code = ANY (${territories}::text[])
        `;
      return parseInt(nbresults[0].count, 10);
    }
    const nbresults = await connection`
      ${prefixQuery}
      `;
    return parseInt(nbresults[0].count, 10);
  }

  public async pairingSourceWithSoliguide(
    source_id: string,
    soliguide_id?: number,
  ) {
    const connection = this.postgresService.getConnection();

    if (soliguide_id) {
      await connection`
      update
        dagster_structure.ids
      set
        soliguide_id = ${soliguide_id}
      where
        id = ${source_id}
      `;
    } else {
      await connection`
      update
        dagster_structure.sources
      set
        is_origin = ${true}
      where
        id = ${source_id}
      `;
    }
  }

  public async deletePairing(soliguide_id: number) {
    const connection = this.postgresService.getConnection();

    if (soliguide_id) {
      await connection.begin(async (psql) => {
        await psql`
          update
            dagster_structure.sources as src
          set
            is_origin = ${false}
          from
            dagster_structure.ids as ids
          where
            ids.id = src.id
          and
            ids.soliguide_id = ${soliguide_id};
        `;

        await psql`
          update
            dagster_structure.ids
          set
            soliguide_id = null
          where
            soliguide_id = ${soliguide_id};
        `;
      });
    }
  }
}
