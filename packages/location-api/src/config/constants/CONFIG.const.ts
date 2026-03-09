import * as Joi from "joi";

export const CONFIG_VALIDATOR = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid("prod", "test", "local").default("local"),
  LOCATION_API_SENTRY_DSN: Joi.string().uri().optional(),
  FRENCH_ADDRESS_API_URL: Joi.string()
    .uri()
    .default("https://data.geopf.fr/geocodage"),
  HERE_API_KEY: Joi.string().required(),
  SOLIGUIDE_DOMAINS: Joi.string(),
});
