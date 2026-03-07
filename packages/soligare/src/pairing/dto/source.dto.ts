import { IsDefined, IsEnum } from 'class-validator';
import { PairingSources, PAIRING_SOURCES } from '@soliguide/common';
import { ApiProperty } from '@nestjs/swagger';

export class SourceDto {
  @IsEnum(PairingSources, {
    message: `Source must be one of these values: ${PAIRING_SOURCES}`,
  })
  @IsDefined()
  @ApiProperty({
    name: 'source',
    enumName: 'PairingSources',
  })
  source: PairingSources;
}
