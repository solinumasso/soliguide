import { captureException, captureMessage } from "@sentry/node";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "node:http";

import { CONFIG } from "../_models";

/**
 * Détermine le niveau de log en fonction de l'environnement
 * - test: silent par défaut, mais peut être overridé par TEST_LOG_LEVEL
 * - dev: debug
 * - production: info
 */
const getLogLevel = () => {
  if (CONFIG.ENV === "test") {
    return process.env.TEST_LOG_LEVEL || "silent";
  }
  if (CONFIG.ENV === "dev") {
    return "debug";
  }
  return "info";
};

export const httpLogger = pinoHttp({
  customErrorObject: (
    _req: IncomingMessage,
    _res: ServerResponse,
    error: Error,
    val: any // skipcq: JS-0323
  ): any => {
    if (CONFIG.ENV !== "dev" && CONFIG.ENV !== "test") {
      if (val) {
        captureMessage(val);
      }
      captureException(error);
    }
    return val;
  },
  autoLogging: CONFIG.ENV !== "test",
  level: getLogLevel(),
});

export const logger = httpLogger.logger;
