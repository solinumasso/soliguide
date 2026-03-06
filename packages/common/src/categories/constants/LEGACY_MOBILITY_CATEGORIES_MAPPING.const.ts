
import { Categories } from "../enums";

export const LEGACY_MOBILITY_CATEGORIES_MAPPING: Record<string, Categories> = {
  chauffeur_driven_transport: Categories.TRANSPORTATION_MOBILITY,
  mobility_assistance: Categories.MOBILITY_FINANCING,
  carpooling: Categories.TRANSPORTATION_MOBILITY,
  provision_of_vehicles: Categories.PERSONAL_VEHICLE_ACCESS,
} as const;

export type LegacyMobilityCategory =
  keyof typeof LEGACY_MOBILITY_CATEGORIES_MAPPING;
