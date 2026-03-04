export interface Config {
  // General
  ENV: string;
  PORT: number;
  VERSION: string;
  WEBAPP_FR_URL: string;
  WEBAPP_ES_URL: string;
  WEBAPP_AD_URL: string;
  SOLIGUIA_AD_URL: string;
  SOLIGUIA_ES_URL: string;
  SOLIGUIDE_FR_URL: string;
  WIDGET_URL: string;
  SOLIGUIDE_LOCATION_API_URL: string;
  SOLIGARE_URL: string;
  JWT_SECRET: string;
  CRON_ENABLED: boolean;

  // Mongo
  MONGODB_URI: string;

  // Google
  GOOGLE_PROJECT_ID?: string;
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;

  // Emails
  DEFAULT_SENDER_EMAIL: string;
  TEST_RECIPIENT_EMAIL: string;
  EMAIL_FROM_DOMAIN: string;

  // S3
  S3_ENDPOINT: string;
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_DOCUMENTS_BUCKET_NAME: string;
  S3_PICTURES_BUCKET_NAME: string;

  // Sentry
  SENTRY_DSN?: string;

  // Posthog
  SOLIGUIDE_POSTHOG_URL: string;
  SOLIGUIDE_POSTHOG_API_KEY?: string;

  // Dev / local
  DEV_ANON: boolean;
  DEV_ANON_PASSWORD_FOR_ALL: string;

  // RabbitMQ
  AMQP_URL?: string;

  // Brevo
  BREVO_LIST_ID_FR?: number;
  BREVO_LIST_ID_ES?: number;
  BREVO_LIST_ID_AD?: number;

  // Dipeeo
  RGPD_EMAIL: string;
}
