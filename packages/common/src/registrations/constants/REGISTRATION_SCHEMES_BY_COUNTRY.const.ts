import { CountryCodes, SoliguideCountries } from "../../location";
import { RegistrationScheme } from "../enums";

/**
 * Which official identifier schemes a place of a given country may carry.
 * A place cannot be identified in several countries at once.
 */
export const REGISTRATION_SCHEMES_BY_COUNTRY: Record<
  SoliguideCountries,
  RegistrationScheme[]
> = {
  [CountryCodes.FR]: [RegistrationScheme.SIRET, RegistrationScheme.RNA],
  [CountryCodes.ES]: [RegistrationScheme.NIF],
  [CountryCodes.AD]: [RegistrationScheme.NRT],
};

/**
 * Which of those schemes are proposed in the forms (place and organization).
 * The others stay accepted by the API and displayed when present.
 */
export const REGISTRATION_FORM_SCHEMES_BY_COUNTRY: Record<
  SoliguideCountries,
  RegistrationScheme[]
> = {
  [CountryCodes.FR]: [RegistrationScheme.SIRET],
  [CountryCodes.ES]: [RegistrationScheme.NIF],
  [CountryCodes.AD]: [RegistrationScheme.NRT],
};
