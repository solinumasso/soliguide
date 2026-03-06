import * as Joi from 'joi';

export const CONFIG_VALIDATOR = Joi.object({
  PORT: Joi.number().default(3003),
  NODE_ENV: Joi.string().valid('prod', 'test', 'local').default('local'),
  SOLIGARE_SENTRY_DSN: Joi.string().uri(),
  POSTGRES_EXTERNAL_USERNAME: Joi.string().default('postgres'),
  POSTGRES_EXTERNAL_PASSWORD: Joi.string().default('postgres'),
  POSTGRES_EXTERNAL_HOST: Joi.string().default('localhost'),
  POSTGRES_EXTERNAL_PORT: Joi.number().default(5432),
  POSTGRES_EXTERNAL_DATABASE: Joi.string().default('postgres'),
});
