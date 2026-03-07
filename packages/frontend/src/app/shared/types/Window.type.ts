import type { Themes } from "@soliguide/common";
import type { Environment } from "./Environment.type";

export interface WindowType {
  CURRENT_DATA?: {
    THEME?: Themes;
    env: Environment;
  };
}
declare global {
  interface Window extends WindowType {}
}
