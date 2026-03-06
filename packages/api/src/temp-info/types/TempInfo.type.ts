import type mongoose from "mongoose";

import type {
  CommonOpeningHours,
  TempInfo as CommonTempInfo,
} from "@soliguide/common";

import type { ModelWithId } from "../../_models";

export type TempInfo = Pick<
  ModelWithId<Omit<CommonTempInfo, "_id">>,
  | "_id"
  | "dateDebut"
  | "dateFin"
  | "description"
  | "name"
  | "placeId"
  | "status"
  | "tempInfoType"
  | "createdAt"
  | "updatedAt"
> & {
  place: mongoose.Types.ObjectId;
  serviceObjectId: mongoose.Types.ObjectId | null;
  hours: ModelWithId<CommonOpeningHours> | null;
  nbDays: number | null;
};
