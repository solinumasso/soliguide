
import { PairingSources } from "../enums";

export const PAIRING_SOURCES = Object.values(PairingSources);

export const SOURCES_TO_DISPLAY = [
  PairingSources.DORA,
  PairingSources.ALISOL,
  PairingSources.CRF,
  PairingSources.CROUS_PDL,
] as const;

export const EXTERNAL_UPDATES_ONLY_SOURCES = [
  PairingSources.CRF,
  PairingSources.CROUS_PDL,
];

export const SOURCES_DISPLAY_EXTERNAL_LINK = [PairingSources.ALISOL];
