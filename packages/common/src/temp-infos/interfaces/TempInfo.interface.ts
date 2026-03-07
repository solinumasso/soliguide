import type { CommonOpeningHours } from "../../hours";
import type { ApiPlace } from "../../place";
import type { TempInfoStatus, TempInfoType } from "../enums";

export interface TempInfo {
  _id: string;

  // Temporary information's properties
  actif: boolean;
  dateDebut: Date;
  dateFin: Date | null;
  description: string | null;
  hours?: CommonOpeningHours;
  isCampaign: boolean;
  name: string | null;
  nbDays?: number;
  status: TempInfoStatus;
  tempInfoType: TempInfoType;
  createdAt: Date;
  updatedAt: Date;

  // Place linked to this temporary information
  place: ApiPlace;
  placeId: number;
  serviceObjectId?: string;
}
