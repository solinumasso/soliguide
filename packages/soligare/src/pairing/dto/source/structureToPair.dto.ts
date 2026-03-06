import { IntersectionType } from '@nestjs/swagger';
import { SourcesDto, OptionsDto, TerritoriesDto } from '..';

export class StructureToPairDto extends IntersectionType(
  SourcesDto,
  OptionsDto,
  TerritoriesDto,
) {}
