import { Pipe, PipeTransform } from "@angular/core";
import { CountryCodes, Phone, parsePhoneNumber } from "@soliguide/common";

@Pipe({ name: "formatInternationalPhoneNumber", standalone: true })
export class FormatInternationalPhoneNumberPipe implements PipeTransform {
  public transform(phone: Phone): string | null {
    return parsePhoneNumber(phone, CountryCodes.FR);
  }
}
