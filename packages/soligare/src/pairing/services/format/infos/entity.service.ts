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
