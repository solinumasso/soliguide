import type { CommonOpeningHours } from "@soliguide/common";

export interface TempInfoObject {
  actif: boolean;
  dateDebut: Date | null;
  dateFin: Date | null;
  description?: string;
  hours?: CommonOpeningHours | null;
  name?: string;
}
