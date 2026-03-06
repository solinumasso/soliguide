import { ExpressRequest, Origin } from "../../../src/_models";
import { ABSTRACT_ORIGIN_REQUEST } from "./ABSTRACT_ORIGIN_REQUEST.mock";

export const ORIGIN_UNDEFINED_REQUEST = {
  ...ABSTRACT_ORIGIN_REQUEST,
  requestInformation: {
    ...ABSTRACT_ORIGIN_REQUEST.requestInformation,
    ...{
      originForLogs: Origin.ORIGIN_UNDEFINED,
    },
  },
} as unknown as ExpressRequest;
