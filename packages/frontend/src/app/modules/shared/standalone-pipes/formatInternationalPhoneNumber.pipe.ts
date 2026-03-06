import { Pipe, PipeTransform } from "@angular/core";
import { Phone, parsePhoneNumber } from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../../models";

@Pipe({ name: "formatInternationalPhoneNumber", standalone: true })
export class FormatInternationalPhoneNumberPipe implements PipeTransform {
  public transform(phone: Phone): string | null {
    return parsePhoneNumber(phone, THEME_CONFIGURATION.country);
  }
}
