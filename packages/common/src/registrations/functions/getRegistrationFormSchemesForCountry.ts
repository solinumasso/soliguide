import { SoliguideCountries } from "../../location";
import { REGISTRATION_FORM_SCHEMES_BY_COUNTRY } from "../constants";
import { RegistrationScheme } from "../enums";

/**
 * Schemes proposed in the forms for a country (a subset of the schemes the API accepts)
 */
export const getRegistrationFormSchemesForCountry = (
  country: SoliguideCountries
): RegistrationScheme[] => REGISTRATION_FORM_SCHEMES_BY_COUNTRY[country] ?? [];
