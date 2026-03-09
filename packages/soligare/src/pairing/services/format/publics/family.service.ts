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
