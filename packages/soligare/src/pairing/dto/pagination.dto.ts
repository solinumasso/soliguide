import { IsInt, IsPositive, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @ApiProperty({
    required: true,
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(50)
  @ApiProperty({
    required: false,
    default: 10,
  })
  limit: number = 10;
}
