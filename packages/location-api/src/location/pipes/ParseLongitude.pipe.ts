import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { isLongitude } from "class-validator";

@Injectable()
export class ParseLongitudePipe implements PipeTransform {
  transform(value: string) {
    if (isLongitude(value)) {
      return value;
    }

    throw new BadRequestException("LONGITUDE_INVALID");
  }
}
