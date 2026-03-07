import { ExpressRequest, Origin } from "../../../src/_models";
import { ABSTRACT_ORIGIN_REQUEST } from "./ABSTRACT_ORIGIN_REQUEST.mock";

export const ORIGIN_SOLIGUIDE_REQUEST = {
  ...ABSTRACT_ORIGIN_REQUEST,
  requestInformation: {
    ...ABSTRACT_ORIGIN_REQUEST.requestInformation,
    ...{
      originForLogs: Origin.SOLIGUIDE,
    },
  },
} as unknown as ExpressRequest;
