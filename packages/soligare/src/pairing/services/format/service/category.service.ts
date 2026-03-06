import {
  PostgresServiceCategory,
  CommonNewPlaceService,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class CategoryService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getCategoryByIdSoliguideFormat(
    id: string,
  ): Promise<Partial<CommonNewPlaceService>> {
    const connection = this.postgresService.getConnection();

    const postgresServiceCategory = await connection<PostgresServiceCategory[]>`
      SELECT *
      FROM dagster_service.category
      where id = ${id}
    `;

    const formatServiceCategory: Partial<CommonNewPlaceService> = {
      category: postgresServiceCategory[0].category,
      description: postgresServiceCategory[0].description,
      name: postgresServiceCategory[0].name,
    };

    return formatServiceCategory;
  }
}
