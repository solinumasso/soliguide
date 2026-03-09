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
