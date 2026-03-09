import { PostgresPublicsGender, PublicsGender } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PublicsGenderService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPublicsGenderByIdSoliguideFormat(
    id: string,
    schema: string,
  ): Promise<PublicsGender[]> {
    const connection = this.postgresService.getConnection();

    const postgresPublicsGender = await connection<PostgresPublicsGender[]>`
      SELECT *
      FROM ${connection(schema)}.publics_gender
      WHERE id = ${id}
      LIMIT 1
    `;

    const publicsGender: PublicsGender[] = [];

    if (postgresPublicsGender[0].men) {
      publicsGender.push(PublicsGender.men);
    }
    if (postgresPublicsGender[0].women) {
      publicsGender.push(PublicsGender.women);
    }

    return publicsGender;
  }
}
