import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SourceIdDto {
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4,5}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    {
      message:
        'source_id doit être un identifiant de 36 caractères au format compatible UUID',
    },
  )
  @ApiProperty({
    type: String,
    required: true,
    example: '8ed66124-1deb-5559-4f27-9162157e6ce1',
    description: 'Identifiant unique de la source',
  })
  source_id: string;
}
