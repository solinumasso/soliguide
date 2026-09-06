import { SOLIGUIDE_COUNTRIES, type SoliguideCountries } from "../../location";
import { REGISTRATION_FORM_SCHEMES_BY_COUNTRY } from "../constants";
import { RegistrationScheme } from "../enums";

/**
 * Schemes proposed in the forms for a country (a subset of the schemes the API accepts).
 * Unknown countries yield an empty list.
 */
export const getRegistrationFormSchemesForCountry = (
  country: unknown
): RegistrationScheme[] =>
  SOLIGUIDE_COUNTRIES.includes(country as SoliguideCountries)
    ? REGISTRATION_FORM_SCHEMES_BY_COUNTRY[country as SoliguideCountries]
    : [];
