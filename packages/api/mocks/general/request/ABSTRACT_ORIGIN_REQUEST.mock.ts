
import { CONFIG, ExpressRequest } from "../../../src/_models";
import { RequestInformation } from "../../../src/middleware";

const DEFAULT_REQUEST: ExpressRequest = {
  headers: {},
  log: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  get: jest
    .fn()
    .mockImplementation((name) =>
      name === "origin" ? CONFIG.SOLIGUIDE_FR_URL : null
    ),
} as unknown as ExpressRequest;

export const ABSTRACT_ORIGIN_REQUEST = {
  ...DEFAULT_REQUEST,
  requestInformation: new RequestInformation(DEFAULT_REQUEST),
} as unknown as ExpressRequest;
