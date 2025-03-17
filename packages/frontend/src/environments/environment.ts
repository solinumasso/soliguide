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
import type { Environment } from "../app/shared/types/Environment.type";

export const environment: Environment = {
  apiUrl: "http://localhost:3001/",
  locationApiUrl: "http://localhost:3000/",
  enableTracing: false,
  environment: "DEV",
  posthogUrl: "https://eu.posthog.com",
  territoriesPresent: "38",
  territorialAnalysis:
    "https://superset.solinum.org/superset/dashboard/territorial-analysis/?standalone=2",
  seasonalAnalysis:
    "https://superset.solinum.org/superset/dashboard/services-closures/?standalone=2",
  searchTracking:
    "https://superset.solinum.org/superset/dashboard/tableau-des-recherches/?standalone=2",
  foodAccess:
    " https://superset.solinum.org/superset/dashboard/acces_alimentation/?standalone=2",
  praticalFilesLink: "https://fiches.soliguide.fr/hc",
  becomeTranslatorFormLink: "https://airtable.com/shrZHYio1ZdnPl1Et",
  proAccountCreationFormLink:
    "https://airtable.com/shrVIdI1OcUSpYXAP?prefill_Comment+vous+nous+avez+connu+?=Soliguide.fr",
  donateLink: "https://www.helloasso.com/associations/solinum/formulaires/1",
  chatWebsiteId: "aeca48ae-8b13-4714-8aa4-10c0da179332",
} as const;
