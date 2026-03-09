import { ApiProperty } from '@nestjs/swagger';
import { IsObject, ValidateNested } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { Type } from 'class-transformer';

export class OptionsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  @ApiProperty({ type: () => PaginationDto })
  options: PaginationDto;
}
