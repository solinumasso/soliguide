/**
 * Official identifier schemes, aligned with org-id.guide prefixes
 * (FR-SIRET, FR-RNA, ES-NIF, AD-NRT)
 */
export enum RegistrationScheme {
  SIRET = "siret",
  RNA = "rna",
  NIF = "nif",
  NRT = "nrt",
}

export const REGISTRATION_SCHEMES: RegistrationScheme[] =
  Object.values(RegistrationScheme);
