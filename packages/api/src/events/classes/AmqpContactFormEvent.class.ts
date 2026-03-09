import type {
  CountryCodes,
  SupportedLanguagesCode,
  Themes,
} from "@soliguide/common";

import type { AmqpEvent } from "../interfaces";

export class AmqpContactFormEvent implements AmqpEvent {
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
  public country: CountryCodes;
  public territory: string | null;
  public locale: SupportedLanguagesCode;
  public frontendUrl: string;
  public theme: Themes | null;

  constructor(params: {
    name: string;
    email: string;
    subject: string;
    message: string;
    country: CountryCodes;
    territory: string | null;
    locale: SupportedLanguagesCode;
    frontendUrl: string;
    theme: Themes | null;
  }) {
    this.name = params.name;
    this.email = params.email;
    this.subject = params.subject;
    this.message = params.message;
    this.country = params.country;
    this.territory = params.territory;
    this.locale = params.locale;
    this.frontendUrl = params.frontendUrl;
    this.theme = params.theme;
  }
}
