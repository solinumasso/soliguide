import { CountryCodes } from "@soliguide/common";
import { CountryISO } from "ngx-intl-tel-input";

export const PREFERRED_COUNTRIES: { [key in CountryCodes]?: CountryISO[] } = {
  [CountryCodes.FR]: [
    CountryISO.France,
    CountryISO.Réunion,
    CountryISO.Martinique,
    CountryISO.Guadeloupe,
    CountryISO.FrenchGuiana,
    CountryISO.FrenchPolynesia,
    CountryISO.Mayotte,
    CountryISO.SaintPierreAndMiquelon,
    CountryISO.WallisAndFutuna,
  ],
  [CountryCodes.ES]: [CountryISO.Spain, CountryISO.Andorra],
  [CountryCodes.AD]: [CountryISO.Andorra],
};
