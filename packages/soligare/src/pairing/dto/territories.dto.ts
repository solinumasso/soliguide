import { ArrayMinSize, IsArray, IsIn, IsOptional } from 'class-validator';
import {
  AnyDepartmentCode,
  CountryCodes,
  DEPARTMENT_CODES,
} from '@soliguide/common';
import { ApiProperty } from '@nestjs/swagger';

export class TerritoriesDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(DEPARTMENT_CODES[CountryCodes.FR], { each: true })
  @ApiProperty({
    isArray: true,
    required: false,
    minLength: 1,
    enum: DEPARTMENT_CODES[CountryCodes.FR],
  })
  territories: AnyDepartmentCode[];
}
