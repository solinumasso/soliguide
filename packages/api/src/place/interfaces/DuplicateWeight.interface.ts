
import { ApiPlace } from "@soliguide/common";
import { ModelWithId } from "../../_models";

export interface DuplicateWeight {
  duplicate: ModelWithId<ApiPlace>;
  weight: number;
}
