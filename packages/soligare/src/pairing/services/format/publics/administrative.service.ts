import {
  PostgresPublicsAdministrative,
  PublicsAdministrative,
} from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PublicsAdministrativeService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPublicsAdministrativeByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<PublicsAdministrative[]> {
    const connection = this.postgresService.getConnection();
    const postgresPublicsAdministrative = await connection<
      PostgresPublicsAdministrative[]
    >`
    SELECT *
    FROM ${connection(schema)}.publics_administrative
    WHERE id = ${id}
    LIMIT 1
  `;

    if (!postgresPublicsAdministrative[0]) {
      return [];
    }

    const administrativeData = postgresPublicsAdministrative[0];

    return Object.values(PublicsAdministrative).filter(
      (enumValue) =>
        enumValue !== PublicsAdministrative.all && // Exclude "all"
        enumValue in administrativeData && // Check if property exists
        administrativeData[enumValue as keyof PostgresPublicsAdministrative] ===
          true, // Check if it's true
    );
  }
}
