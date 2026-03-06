import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PairingDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  soliguide_id: number;
}
