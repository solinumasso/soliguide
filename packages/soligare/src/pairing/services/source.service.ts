import { Injectable } from '@nestjs/common';
import {
  AnyDepartmentCode,
  CommonPlaceSource,
  PostgresSource,
} from '@soliguide/common';
import { PostgresService } from './postgres.service';
import postgres from 'postgres';

@Injectable()
export class SourceService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getAvailableSources(
    departmentCode?: AnyDepartmentCode[],
  ): Promise<string[]> {
    const connection: postgres.Sql = this.postgresService.getConnection();

    if (departmentCode) {
      const availableSources = await connection`
        select
          distinct src.name
        from
          dagster_structure.sources as src
        inner join
          dagster_structure.positions as pos
            on src.id=pos.id
        inner join
          dagster_structure.ids as i
            on src.id=i.id
        where
          pos.department_code = ANY (${departmentCode}::text[])
        and
          i.soliguide_id is null
        and
          src.is_origin is false
        order by
          src.name
        `;
      return availableSources.map((source): string => source.name);
    }
    const availableSources = await connection`
      select
        distinct src.name
      from
        dagster_structure.sources as src
      inner join
        dagster_structure.ids as i
          on src.id=i.id
      where
        i.soliguide_id is null
      and
        src.is_origin is false
      order by
        src.name
      `;
    return availableSources.map((source): string => source.name);
  }

  public async getDetails(sourceId: string): Promise<CommonPlaceSource | null> {
    const connection: postgres.Sql = this.postgresService.getConnection();

    const sourceDetails = await connection<PostgresSource[]>`
      SELECT *
      FROM dagster_structure.sources
      WHERE id = ${sourceId}
    `;

    if (sourceDetails.length === 0) {
      return null;
    }

    return new CommonPlaceSource({
      name: sourceDetails[0].name,
      ids: [{ id: sourceDetails[0].id, url: sourceDetails[0].url }],
      isOrigin: sourceDetails[0].is_origin,
      license: sourceDetails[0].license,
    });
  }
}
