import { PipeTransform, Injectable } from "@nestjs/common";

@Injectable()
export class ParsePostalCodePipe
  implements PipeTransform<string, string | undefined>
{
  transform(postalCode?: string): string | undefined {
    if (!postalCode) {
      return undefined;
    }

    return postalCode.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }
}
