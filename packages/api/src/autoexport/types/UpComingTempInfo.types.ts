import { TempInfo } from "../../temp-info/types";

export type UpComingTempInfo = Array<{
  placeId: number;
  tempInfo: TempInfo[];
}>;
