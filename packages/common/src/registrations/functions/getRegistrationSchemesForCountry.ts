import { SOLIGUIDE_COUNTRIES, type SoliguideCountries } from "../../location";
import { REGISTRATION_SCHEMES_BY_COUNTRY } from "../constants";
import { RegistrationScheme } from "../enums";

/**
 * Schemes the API accepts for a country.
 * Anything that is not a Soliguide country (undefined, unknown code, prototype keys such as
 * "constructor") yields an empty list so that no identifier is accepted.
 */
export const getRegistrationSchemesForCountry = (
  country: unknown
): RegistrationScheme[] =>
  SOLIGUIDE_COUNTRIES.includes(country as SoliguideCountries)
    ? REGISTRATION_SCHEMES_BY_COUNTRY[country as SoliguideCountries]
    : [];
