import { SoliguideCountries } from "../../location";
import { REGISTRATION_SCHEMES_BY_COUNTRY } from "../constants";
import { RegistrationScheme } from "../enums";

export const getRegistrationSchemesForCountry = (
  country: SoliguideCountries
): RegistrationScheme[] => REGISTRATION_SCHEMES_BY_COUNTRY[country] ?? [];
