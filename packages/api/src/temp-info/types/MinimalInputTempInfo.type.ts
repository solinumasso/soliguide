import { TempInfo } from "./TempInfo.type";

export type MinimalInputTempInfo = Partial<
  Pick<
    TempInfo,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "dateFin"
    | "description"
    | "hours"
    | "name"
    | "nbDays"
    | "serviceObjectId"
  >
> &
  Omit<
    TempInfo,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "dateFin"
    | "description"
    | "hours"
    | "name"
    | "nbDays"
    | "serviceObjectId"
  >;
