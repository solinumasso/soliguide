import { ExpressRequest, Origin } from "../../../src/_models";
import { ABSTRACT_ORIGIN_REQUEST } from "./ABSTRACT_ORIGIN_REQUEST.mock";

export const ORIGIN_SOLINUM_ORG_REQUEST = {
  ...ABSTRACT_ORIGIN_REQUEST,
  get: jest
    .fn()
    .mockImplementation((name) =>
      name === "origin" ? "https://solinum.org" : null
    ),
  requestInformation: {
    ...ABSTRACT_ORIGIN_REQUEST.requestInformation,
    ...{
      originForLogs: Origin.SOLINUM_ORG,
    },
  },
} as unknown as ExpressRequest;
