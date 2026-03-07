import type { TempInfo } from "./TempInfo.interface";

import type { ApiPlace } from "../../place";

export interface ApiTempInfoResponse {
  place: ApiPlace;
  tempInfo: TempInfo[];
}
