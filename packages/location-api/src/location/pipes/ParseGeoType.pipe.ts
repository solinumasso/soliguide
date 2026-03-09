import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { GeoTypes } from "@soliguide/common";

@Injectable()
export class ParseGeoTypePipe implements PipeTransform<string, GeoTypes> {
  transform(value: string): GeoTypes | null {
    const geoType = value as GeoTypes;
    if (!geoType) {
      return null;
    }
    if (!Object.values(GeoTypes).includes(geoType)) {
      throw new BadRequestException("GEOTYPE_NOT_VALID");
    }
    return geoType;
  }
}
