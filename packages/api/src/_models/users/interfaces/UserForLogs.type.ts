import { CommonUserForLogs } from "@soliguide/common";
import { Origin } from "../enums";

export interface UserForLogs extends CommonUserForLogs {
  origin: Origin;
}
