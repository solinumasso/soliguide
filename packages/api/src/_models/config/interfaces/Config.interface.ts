/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

  // Emails & Mailgun
  DEFAULT_SENDER_EMAIL: string;
  TEST_RECIPIENT_EMAIL: string;
  EMAIL_FROM_DOMAIN: string;
  MAILGUN_API_KEY: string;

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

  // Dipeeo
  RGPD_EMAIL: string;
}
