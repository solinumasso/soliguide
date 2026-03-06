import envSchema from "env-schema";

import { ENV_SCHEMA } from "./ENV_SCHEMA.const";

import { Config } from "../interfaces";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

const dotenvConfig = (() => {
  // If we are in test mode only in local
  if (process.env.NODE_ENV === "test" && !process.env.DOCKER_ENV) {
    const testEnvPath = resolve(process.cwd(), ".env.test");

    if (existsSync(testEnvPath)) {
      return {
        path: testEnvPath,
      };
    }
  }
  return true;
})();

// If values are missing in the '.env' file and no default values are provided for those in the 'ENV_SCHEMA', the app will automatically crash
export const CONFIG = envSchema<Config>({
  schema: ENV_SCHEMA,
  dotenv: dotenvConfig,
});
