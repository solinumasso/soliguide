import { TempInfo } from "./TempInfo.type";

export type InputTempInfoInServices = Pick<
  TempInfo,
  "dateDebut" | "dateFin"
> & {
  actif: boolean;
  isCampaign: boolean;
};
