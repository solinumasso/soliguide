import { PlaceChangesSection } from "@soliguide/common";

export interface CrowdsourceOption {
  label: string;
  value: unknown;
}

export type CrowdsourceIconType =
  | "snowflake"
  | "flame"
  | "clock"
  | "map-pin"
  | "camera"
  | null;

export interface CrowdsourceSectionConfig {
  eyebrow: string;
  title: string;
  question: string;
  options: CrowdsourceOption[];
  iconType: CrowdsourceIconType;
}

export const CROWDSOURCE_SECTIONS: Partial<
  Record<PlaceChangesSection, CrowdsourceSectionConfig>
> = {
  [PlaceChangesSection.modalities]: {
    eyebrow: "Info manquante",
    title: "Ce lieu est-il climatisé ?",
    question:
      "Aidez la communauté en indiquant si vous savez si ce lieu propose la climatisation.",
    options: [
      { label: "Oui", value: true },
      { label: "Non", value: false },
      { label: "Je ne sais pas", value: null },
    ],
    iconType: "snowflake",
  },
};
