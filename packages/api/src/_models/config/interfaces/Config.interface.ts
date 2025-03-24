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
import type { LogLevelDesc } from "loglevel";

export interface Config {
  // General
  ENV: string;
  PORT: number;
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
  RESTORE_SYNC: boolean;

  // Mongo
  MONGODB_URI: string;

  // Google
  GOOGLE_PROJECT_ID?: string;
  GOOGLE_API_KEY?: string;

  // Emails & Mailgun
  DEFAULT_SENDER_EMAIL: string;
  TEST_RECIPIENT_EMAIL: string;
  EMAIL_FROM_DOMAIN: string;
  MAILGUN_API_KEY: string;

  // Airtable
  AT_API_KEY: string;
  AT_BASE_ID_SOLIGUIDE: string;
  AT_TABLE_ID_FICHE: string;
  AT_TABLE_ID_USER: string;
  AT_FIELD_PLACE_ID: string;
  AT_FIELD_PLACE_CITY: string;
  AT_FIELD_PLACE_NAME: string;
  AT_FIELD_PLACE_OPENING: string;
  AT_FIELD_PLACE_ORGA: string;
  AT_FIELD_PLACE_POSTAL_CODE: string;
  AT_FIELD_PLACE_SERVICES: string;
  AT_FIELD_PLACE_STATUS: string;
  AT_FIELD_PLACE_TERRITORY: string;
  AT_FIELD_PLACE_VISIBILITY: string;
  AT_FIELD_PLACE_TYPE: string;
  AT_FIELD_PLACE_CAMPAIGN_STATUS_MAJ: string;
  AT_FIELD_PLACE_CAMPAIGN_AUTONOMY: string;
  AT_FIELD_PLACE_CAMPAIGN_REMIND_DATE: string;
  AT_FIELD_USER_ID: string;
  AT_FIELD_USER_FIRSTNAME: string;
  AT_FIELD_USER_LASTNAME: string;
  AT_FIELD_USER_EMAIL: string;
  AT_FIELD_USER_ORGA: string;
  AT_FIELD_USER_PHONE: string;
  AT_FIELD_USER_STATUS: string;
  AT_FIELD_USER_TITLE: string;
  AT_FIELD_USER_TRANSLATOR: string;
  AT_FIELD_USER_VERIFIED: string;
  AT_FIELD_USER_BLOCKED: string;
  AT_FIELD_USER_DELETED: string;
  AT_FIELD_USER_CREATION_EMAIL: string;
  AT_FIELD_USER_CREATION_NAME: string;
  AT_FIELD_USER_CREATION_NEW: string;
  AT_FIELD_USER_CREATION_PHONE: string;
  AT_FIELD_USER_CREATION_TITLE: string;
  AT_FIELD_USER_CREATION_TERRITORIES: string;
  AT_FIELD_USER_CAMPAIGN_EMAIL_STATUS: string;

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

  // Google Docs for events and synonyms
  SYNONYMS_GOOGLE_DOCS_LINK?: string;

  // RabbitMQ
  AMQP_URL?: string;

  // Typesense (search engine)
  TYPESENSE_NODES_URL: string;
  TYPESENSE_API_KEY?: string;
  TYPESENSE_LOG_LEVEL?: LogLevelDesc;
  TYPESENSE_COLLECTIONS_PREFIX?: string;

  // Dipeeo
  RGPD_EMAIL: string;
}
