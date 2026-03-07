
import { IntersectionType } from '@nestjs/swagger';
import { PairingDto, SourceIdDto } from '..';

export class PairBodyDto extends IntersectionType(SourceIdDto, PairingDto) {}
