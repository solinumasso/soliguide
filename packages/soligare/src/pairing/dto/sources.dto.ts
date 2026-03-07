import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SourcesDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    required: false,
    minLength: 1,
  })
  sources: string[];
}
