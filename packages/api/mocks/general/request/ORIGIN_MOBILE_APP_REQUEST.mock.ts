import { ExpressRequest, Origin } from "../../../src/_models";
import { ABSTRACT_ORIGIN_REQUEST } from "./ABSTRACT_ORIGIN_REQUEST.mock";

export const ORIGIN_MOBILE_APP_REQUEST = {
  ...ABSTRACT_ORIGIN_REQUEST,
  headers: {
    "user-agent":
      "Soliguide Webview App ; Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },
  requestInformation: {
    ...ABSTRACT_ORIGIN_REQUEST.requestInformation,
    ...{
      originForLogs: Origin.MOBILE_APP,
    },
  },
} as unknown as ExpressRequest;
