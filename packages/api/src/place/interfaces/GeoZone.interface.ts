import { GeoTypes } from "@soliguide/common";

import { ApiSubSchema } from "./ApiSubSchema.interface";

export interface GeoZone extends ApiSubSchema {
  geoType: GeoTypes | null;
  geoValue: string;
  label: string;
}
