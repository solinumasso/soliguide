import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { isLatitude } from "class-validator";

@Injectable()
export class ParseLatitudePipe implements PipeTransform {
  transform(value: string) {
    if (isLatitude(value)) {
      return value;
    }

    throw new BadRequestException("LATITUDE_INVALID");
  }
}
