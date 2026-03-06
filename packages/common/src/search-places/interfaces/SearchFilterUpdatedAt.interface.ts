import { UpdatedAtInterval } from "../enums";

export interface SearchFilterUpdatedAt {
  intervalType: UpdatedAtInterval | null;
  value: Date | null;
}
