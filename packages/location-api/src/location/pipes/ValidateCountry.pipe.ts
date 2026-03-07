import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from "@nestjs/common";
import { SOLIGUIDE_COUNTRIES, SoliguideCountries } from "@soliguide/common";

@Injectable()
export class ValidateCountryPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // Check if we're dealing with a route parameter named 'country'
    if (metadata.type === "param" && metadata.data === "country") {
      if (typeof value === "string") {
        if (
          SOLIGUIDE_COUNTRIES.includes(
            value.toLowerCase() as SoliguideCountries
          )
        ) {
          return value.toLowerCase();
        }
      }

      throw new BadRequestException("COUNTRY_NOT_FOUND");
    }

    return value;
  }
}
