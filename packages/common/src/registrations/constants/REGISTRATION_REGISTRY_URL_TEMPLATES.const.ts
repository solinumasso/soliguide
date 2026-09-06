import { RegistrationScheme } from "../enums";

/**
 * Public reference website for each scheme. `{value}` is replaced by the identifier.
 * `null` when no public lookup exists.
 */
export const REGISTRATION_REGISTRY_URL_TEMPLATES: Record<
  RegistrationScheme,
  string | null
> = {
  // Annuaire des entreprises (Insee / SIRENE), one page per establishment
  [RegistrationScheme.SIRET]:
    "https://annuaire-entreprises.data.gouv.fr/etablissement/{value}",
  // Data-asso (Ministère chargé de la vie associative), one page per association
  [RegistrationScheme.RNA]:
    "https://www.data-asso.fr/annuaire/association/{value}",
  // Registro Nacional de Asociaciones (Ministerio del Interior): search form, no direct link by NIF
  [RegistrationScheme.NIF]: "https://sede.mir.gob.es/nfrontal/webasocia2.html",
  // No public online registry in Andorra
  [RegistrationScheme.NRT]: null,
};
