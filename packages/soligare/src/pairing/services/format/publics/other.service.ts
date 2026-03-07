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
