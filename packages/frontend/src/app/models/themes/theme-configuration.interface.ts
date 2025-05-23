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
import type {
  SupportedLanguagesCode,
  SoliguideCountries,
} from "@soliguide/common";

export enum PrivateDashboards {
  TerritorialAnalysis = "territorialAnalysis",
  SeasonalAnalysis = "seasonalAnalysis",
  FoodAccess = "foodAccess",
  OlympicGames = "olympicGames",
}

export enum PublicDashboards {
  SearchTracking = "searchTracking",
}
type Dashboards = PrivateDashboards | PublicDashboards;

export interface SolidataDashboardConfig {
  label: string;
  dashboardUrl: string;
  seoUrl: string;
}

export interface ThemeConfiguration {
  brandName: string;
  logos: {
    inline: string;
    original: string;
    symbol: string;
    sponsor?: string;
  };
  country: SoliguideCountries;
  defaultCoordinates: readonly number[];
  defaultLanguage: SupportedLanguagesCode;
  suggestedLanguages: readonly SupportedLanguagesCode[];
  mobileApp?: {
    androidLink: string;
    appleLink: string;
  };
  helpEnabled: boolean;
  solinumHomeLink: string;
  aboutSolinumLink?: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  becomeVolunteerEnabled: boolean;
  contactFormEnabled: boolean;
  locationAutocompletePlaceholder: string;
  solidata?: {
    [key in Dashboards]: SolidataDashboardConfig;
  };
  praticalFilesLink?: string;
  becomeTranslatorFormLink?: string;
  donateLink?: string;
  proAccountCreationFormLink?: string;
  chatWebsiteId?: string;
  territoriesStats?: {
    territoriesPresent: number;
  };
  showTranslationMenuDropdown?: boolean;
  showSoligareMenu?: boolean;
}
