import { BOTS_LIST } from "./BOTS_LIST.const";

export const BOTS_LIST_REGEXP = new RegExp(
  BOTS_LIST.map((source: RegExp) => source).join("|"),
  "i"
);
