import { PostgresLanguage } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class LanguageService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getLanguageByIdSoliguideFormat(id: string): Promise<string[]> {
    const connection = this.postgresService.getConnection();

    const postgresLanguage = await connection<PostgresLanguage[]>`
      SELECT *
      FROM dagster_structure.languages
      WHERE id = ${id}
    `;

    return postgresLanguage.map(
      (language: PostgresLanguage) => language.language,
    );
  }
}
