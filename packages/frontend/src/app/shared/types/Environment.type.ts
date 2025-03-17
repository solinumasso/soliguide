/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
export interface Environment {
  apiUrl: string;
  locationApiUrl: string;
  chatWebsiteId?: string;
  enableTracing: boolean;
  environment: "DEV" | "PROD" | "PREPROD";
  posthogUrl: string;
  posthogApiKey?: string;
  sentryDsn?: string;
  territoriesPresent: string;
  territorialAnalysis?: string;
  seasonalAnalysis?: string;
  searchTracking?: string;
  foodAccess?: string;
  praticalFilesLink?: string;
  becomeTranslatorFormLink?: string;
  proAccountCreationFormLink?: string;
  donateLink?: string;
}
