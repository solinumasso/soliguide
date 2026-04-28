import { VersionContextProvider } from "../../../versioning-engine/dsl";

export type V20260426JsonRecord = Record<string, unknown>;

export type V20260426LegacyPlace = {
  _id?: string | number;
  lieu_id?: string | number;
  auto?: boolean | null;
  close?: V20260426JsonRecord | null;
  geoZones?: unknown[] | null;
  sourceLanguage?: string | null;
  position?: {
    addresse?: string | null;
    codePostal?: string | null;
    complementAdresse?: string | null;
    departement?: string | null;
    departementCode?: string | null;
    pays?: string | null;
    ville?: string | null;
    slugs?: {
      departement?: string | null;
      pays?: string | null;
    } | null;
  } | null;
  publics?: {
    ukrainePrecisions?: string | null;
  } | null;
  services_all?: Array<{
    categorie?: string | number | null;
    jobsList?: unknown[] | null;
  }> | null;
};

export type V20260426Context = {
  legacyPlacesById: Record<string, V20260426LegacyPlace>;
};

export interface V20260426ContextProvider
  extends VersionContextProvider<V20260426Context> {}

export const V20260426_CONTEXT_PROVIDER = Symbol("V20260426ContextProvider");
