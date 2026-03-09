import { PostgresPhone, Phone } from '@soliguide/common';
import { PostgresService } from '../../postgres.service';

export class PhoneService {
  constructor(private readonly postgresService: PostgresService) {}

  public async getPhoneByIdSoliguideFormat(id: string): Promise<Phone[]> {
    const connection = this.postgresService.getConnection();

    const postgresPhones = await connection<PostgresPhone[]>`
      SELECT *
      FROM dagster_structure.phone
      WHERE id = ${id}
    `;

    return postgresPhones.map((phone: PostgresPhone) => {
      const formatPhone: Phone = {
        label: phone.label ?? null,
        phoneNumber: phone.number,
        countryCode: phone.country_code,
        isSpecialPhoneNumber: phone.is_special,
      };
      return formatPhone;
    });
  }
}
