import type { ApiPlace } from "@soliguide/common";

import type { ModelWithId } from "../../_models";
import type { TempInfo } from "./TempInfo.type";

export type PopulatedTempInfo = Omit<TempInfo, "place"> & {
  place: ModelWithId<ApiPlace>;
};
