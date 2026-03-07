import { PairingSources } from "../enums";
import { ExternalSourceToDisplay } from "../types";

export const EXTERNAL_SOURCE_MAPPING: Record<
  ExternalSourceToDisplay,
  {
    label: string;
    licenseLink?: string;
    licenseLabel?: string;
  }
> = {
  [PairingSources.DORA]: {
    label: "DORA via data·inclusion",
    licenseLink: "https://www.etalab.gouv.fr/licence-ouverte-open-licence/",
    licenseLabel: "licence Open Data",
  },
  [PairingSources.CRF]: { label: "Croix-Rouge française" },
  [PairingSources.ALISOL]: { label: "Alisol (AD2S)" },
  [PairingSources.CROUS_PDL]: {
    label: "Crous - Pays de la Loire",
  },
};
