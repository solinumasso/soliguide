import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { isString } from "class-validator";

@Injectable()
export class ParseSearchPipe implements PipeTransform {
  transform(value: string) {
    if (!isString(value)) {
      throw new BadRequestException("STRING_INVALID");
    }

    const cleaned = value
      .replaceAll(/[:;!?@#$%&*]/g, "")
      .trim()
      .replaceAll(/\s+/g, " ");

    if (cleaned.length >= 2) {
      return cleaned;
    }

    throw new BadRequestException("STRING_INVALID");
  }
}
