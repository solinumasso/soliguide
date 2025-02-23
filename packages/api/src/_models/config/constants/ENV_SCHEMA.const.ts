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
import type { JSONSchemaType } from "env-schema";
import type { Config } from "../interfaces";

export const ENV_SCHEMA: JSONSchemaType<Config> = {
  type: "object",
  required: [
    "JWT_SECRET",
    "MAILGUN_API_KEY",
    "AT_API_KEY",
    "AT_BASE_ID_SOLIGUIDE",
    "AT_TABLE_ID_FICHE",
    "AT_TABLE_ID_USER",
    "AT_FIELD_PLACE_ID",
    "AT_FIELD_PLACE_CITY",
    "AT_FIELD_PLACE_POSTAL_CODE",
    "AT_FIELD_PLACE_NAME",
    "AT_FIELD_PLACE_OPENING",
    "AT_FIELD_PLACE_ORGA",
    "AT_FIELD_PLACE_SERVICES",
    "AT_FIELD_PLACE_STATUS",
    "AT_FIELD_PLACE_TERRITORY",
    "AT_FIELD_PLACE_VISIBILITY",
    "AT_FIELD_PLACE_TYPE",
    "AT_FIELD_PLACE_CAMPAIGN_STATUS_MAJ",
    "AT_FIELD_PLACE_CAMPAIGN_AUTONOMY",
    "AT_FIELD_PLACE_CAMPAIGN_REMIND_DATE",
    "AT_FIELD_USER_ID",
    "AT_FIELD_USER_FIRSTNAME",
    "AT_FIELD_USER_LASTNAME",
    "AT_FIELD_USER_EMAIL",
    "AT_FIELD_USER_ORGA",
    "AT_FIELD_USER_PHONE",
    "AT_FIELD_USER_STATUS",
    "AT_FIELD_USER_TITLE",
    "AT_FIELD_USER_TRANSLATOR",
    "AT_FIELD_USER_VERIFIED",
    "AT_FIELD_USER_BLOCKED",
    "AT_FIELD_USER_DELETED",
    "AT_FIELD_USER_CREATION_EMAIL",
    "AT_FIELD_USER_CREATION_NAME",
    "AT_FIELD_USER_CREATION_NEW",
    "AT_FIELD_USER_CREATION_PHONE",
    "AT_FIELD_USER_CREATION_TITLE",
    "AT_FIELD_USER_CREATION_TERRITORIES",
    "AT_FIELD_USER_CAMPAIGN_EMAIL_STATUS",
    "S3_ACCESS_KEY",
    "S3_SECRET_KEY",
  ],
  properties: {
    ENV: {
      type: "string",
      default: "dev",
    },
    PORT: {
      type: "number",
      default: 3001,
    },
    WEBAPP_FR_URL: {
      type: "string",
      default: "http://localhost:5173/",
    },
    WEBAPP_ES_URL: {
      type: "string",
      default: "http://localhost:5173/",
    },
    WEBAPP_AD_URL: {
      type: "string",
      default: "http://localhost:5173/",
    },
    WIDGET_URL: {
      type: "string",
      default: "http://localhost:4201/",
    },
    SOLIGUIA_AD_URL: {
      type: "string",
      default: "http://localhost:4220/",
    },
    SOLIGUIA_ES_URL: {
      type: "string",
      default: "http://localhost:4210/",
    },
    SOLIGUIDE_FR_URL: {
      type: "string",
      default: "http://localhost:4200/",
    },
    SOLIGUIDE_LOCATION_API_URL: {
      type: "string",
      default: "http://localhost:3000/",
    },
    SOLIGARE_URL: {
      type: "string",
      default: "http://localhost:3003/",
    },

    JWT_SECRET: {
      type: "string",
    },
    CRON_ENABLED: {
      type: "boolean",
      default: false,
    },
    RESTORE_SYNC: {
      type: "boolean",
      default: false,
    },
    MONGODB_URI: {
      type: "string",
      default: "mongodb://127.0.0.1:27017/soliguide?replicaSet=rs0",
    },
    TYPESENSE_NODES_URL: {
      type: "string",
      default: "http://127.0.0.1:8108",
    },
    TYPESENSE_API_KEY: {
      type: "string",
      nullable: true,
    },
    TYPESENSE_LOG_LEVEL: {
      type: "string",
      default: "info",
      enum: ["trace", "debug", "info", "warn", "error"],
      nullable: true,
    },
    TYPESENSE_COLLECTIONS_PREFIX: {
      type: "string",
      nullable: true,
    },
    GOOGLE_PROJECT_ID: {
      type: "string",
      nullable: true,
    },
    GOOGLE_API_KEY: {
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
    MAILGUN_API_KEY: {
      type: "string",
    },
    EMAIL_FROM_DOMAIN: {
      type: "string",
      default: "solinum.org",
    },
    AMQP_URL: {
      type: "string",
      nullable: true,
    },
    AT_API_KEY: {
      type: "string",
    },
    AT_BASE_ID_SOLIGUIDE: {
      type: "string",
    },
    AT_TABLE_ID_FICHE: {
      type: "string",
    },
    AT_TABLE_ID_USER: {
      type: "string",
    },
    AT_FIELD_PLACE_ID: {
      type: "string",
    },
    AT_FIELD_PLACE_CITY: {
      type: "string",
    },
    AT_FIELD_PLACE_NAME: {
      type: "string",
    },
    AT_FIELD_PLACE_OPENING: {
      type: "string",
    },
    AT_FIELD_PLACE_ORGA: {
      type: "string",
    },
    AT_FIELD_PLACE_POSTAL_CODE: {
      type: "string",
    },
    AT_FIELD_PLACE_SERVICES: {
      type: "string",
    },
    AT_FIELD_PLACE_STATUS: {
      type: "string",
    },
    AT_FIELD_PLACE_TERRITORY: {
      type: "string",
    },
    AT_FIELD_PLACE_VISIBILITY: {
      type: "string",
    },
    AT_FIELD_PLACE_TYPE: {
      type: "string",
    },
    AT_FIELD_PLACE_CAMPAIGN_STATUS_MAJ: {
      type: "string",
    },
    AT_FIELD_PLACE_CAMPAIGN_AUTONOMY: {
      type: "string",
    },
    AT_FIELD_PLACE_CAMPAIGN_REMIND_DATE: {
      type: "string",
    },
    AT_FIELD_USER_ID: {
      type: "string",
    },
    AT_FIELD_USER_FIRSTNAME: {
      type: "string",
    },
    AT_FIELD_USER_LASTNAME: {
      type: "string",
    },
    AT_FIELD_USER_EMAIL: {
      type: "string",
    },
    AT_FIELD_USER_ORGA: {
      type: "string",
    },
    AT_FIELD_USER_PHONE: {
      type: "string",
    },
    AT_FIELD_USER_STATUS: {
      type: "string",
    },
    AT_FIELD_USER_TITLE: {
      type: "string",
    },
    AT_FIELD_USER_TRANSLATOR: {
      type: "string",
    },
    AT_FIELD_USER_VERIFIED: {
      type: "string",
    },
    AT_FIELD_USER_DELETED: {
      type: "string",
    },
    AT_FIELD_USER_BLOCKED: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_EMAIL: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_NAME: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_NEW: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_PHONE: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_TITLE: {
      type: "string",
    },
    AT_FIELD_USER_CREATION_TERRITORIES: {
      type: "string",
    },
    AT_FIELD_USER_CAMPAIGN_EMAIL_STATUS: {
      type: "string",
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
    SYNONYMS_GOOGLE_DOCS_LINK: {
      type: "string",
      nullable: true,
    },
    RGPD_EMAIL: {
      type: "string",
      default: "dipeeo@solinum.org",
    },
  },
};
