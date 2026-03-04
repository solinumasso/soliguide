import type { JSONSchemaType } from "env-schema";
import type { Config } from "../interfaces";

export const ENV_SCHEMA: JSONSchemaType<Config> = {
  type: "object",
  required: ["JWT_SECRET", "S3_ACCESS_KEY", "S3_SECRET_KEY"],
  properties: {
    ENV: {
      type: "string",
      default: "dev",
    },
    PORT: {
      type: "number",
      default: 3001,
    },
    VERSION: {
      type: "string",
      default: "0.0.0",
    },
    WEBAPP_FR_URL: {
      type: "string",
      default: "http://localhost:5173",
    },
    WEBAPP_ES_URL: {
      type: "string",
      default: "http://localhost:5173",
    },
    WEBAPP_AD_URL: {
      type: "string",
      default: "http://localhost:5173",
    },
    WIDGET_URL: {
      type: "string",
      default: "http://localhost:4201",
    },
    SOLIGUIA_AD_URL: {
      type: "string",
      default: "http://localhost:4220",
    },
    SOLIGUIA_ES_URL: {
      type: "string",
      default: "http://localhost:4210",
    },
    SOLIGUIDE_FR_URL: {
      type: "string",
      default: "http://localhost:4200",
    },
    SOLIGUIDE_LOCATION_API_URL: {
      type: "string",
      default: "http://localhost:3000",
    },
    SOLIGARE_URL: {
      type: "string",
      default: "http://localhost:3003",
    },
    JWT_SECRET: {
      type: "string",
    },
    CRON_ENABLED: {
      type: "boolean",
      default: false,
    },
    MONGODB_URI: {
      type: "string",
      default: "mongodb://127.0.0.1:27017/soliguide?replicaSet=rs0",
    },
    GOOGLE_PROJECT_ID: {
      type: "string",
      nullable: true,
    },
    GOOGLE_API_KEY: {
      type: "string",
      nullable: true,
    },
    GEMINI_API_KEY: {
      type: "string",
      nullable: true,
    },
    DEFAULT_SENDER_EMAIL: {
      type: "string",
      default: "tech@solinum.org",
    },
    TEST_RECIPIENT_EMAIL: {
      type: "string",
      default: "tech@solinum.org",
    },
    EMAIL_FROM_DOMAIN: {
      type: "string",
      default: "solinum.org",
    },
    AMQP_URL: {
      type: "string",
      nullable: true,
    },
    BREVO_LIST_ID_FR: {
      type: "number",
      nullable: true,
    },
    BREVO_LIST_ID_ES: {
      type: "number",
      nullable: true,
    },
    BREVO_LIST_ID_AD: {
      type: "number",
      nullable: true,
    },
    S3_ENDPOINT: {
      type: "string",
      default: "http://localhost:9000",
    },
    S3_ACCESS_KEY: {
      type: "string",
    },
    S3_SECRET_KEY: {
      type: "string",
    },
    S3_DOCUMENTS_BUCKET_NAME: {
      type: "string",
      default: "documents",
    },
    S3_PICTURES_BUCKET_NAME: {
      type: "string",
      default: "pictures",
    },
    SENTRY_DSN: {
      type: "string",
      nullable: true,
    },
    SOLIGUIDE_POSTHOG_URL: {
      type: "string",
      default: "https://eu.posthog.com",
    },
    SOLIGUIDE_POSTHOG_API_KEY: {
      type: "string",
      nullable: true,
    },
    DEV_ANON: {
      type: "boolean",
      default: true,
    },
    DEV_ANON_PASSWORD_FOR_ALL: {
      type: "string",
      default: "soliguide",
    },
    RGPD_EMAIL: {
      type: "string",
      default: "dipeeo@solinum.org",
    },
  },
};
