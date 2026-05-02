import { Categories } from "../../categories";
import { DEFAULT_SERVICES_TO_EXCLUDE } from "./DEFAULT_SERVICES_TO_EXCLUDE.const";

export const DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION = [
  Categories.ADDICTIONS,
  ...DEFAULT_SERVICES_TO_EXCLUDE,
];
