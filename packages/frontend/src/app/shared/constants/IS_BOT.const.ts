import { BOTS_LIST_REGEXP } from "./BOTS_LIST_REGEXP.const";

export const IS_BOT = BOTS_LIST_REGEXP.test(window.navigator.userAgent);
