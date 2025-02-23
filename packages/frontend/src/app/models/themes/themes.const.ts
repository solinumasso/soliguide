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
import {
  Themes,
  CountryCodes,
  SupportedLanguagesCode,
  initializeCategoriesByTheme,
} from "@soliguide/common";
import type { ThemeConfiguration } from "./theme-configuration.interface";
import { environment } from "../../../environments/environment";
// Importing from "../../shared" leads to a cyclic dependency hell
import { themeService } from "../../shared/services";

const DEFAULT_THEME_VALUE: Pick<
  ThemeConfiguration,
  "solinumHomeLink" | "socialMedia"
> = {
  solinumHomeLink: "https://www.solinum.org/",
  socialMedia: {},
};

// TODO: create themes on Common
const THEMES: Record<Themes, ThemeConfiguration> = {
  [Themes.SOLIGUIDE_FR]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguide",
    logos: {
      inline: "soliguide-inline.svg",
      original: "soliguide.svg",
      symbol: "soliguide-symbol.svg",
    },
    country: CountryCodes.FR,
    defaultCoordinates: [2.289949112, 48.85846184], // Paris
    defaultLanguage: SupportedLanguagesCode.FR,
    suggestedLanguages: [SupportedLanguagesCode.FR],
    mobileApp: {
      androidLink:
        "https://play.google.com/store/apps/details?id=com.soliguide.soliguide&hl=fr",
      appleLink:
        "https://apps.apple.com/fr/app/soliguide/id1495949521#?platform=iphone",
    },
    helpEnabled: true,
    aboutSolinumLink: "https://www.solinum.org/activites/",
    socialMedia: {
      instagram: "https://www.instagram.com/solinum.asso/",
      linkedin: "https://linkedin.com/company/assosolinum",
      facebook: "https://www.facebook.com/soliguide/",
      youtube: "https://youtube.com/channel/UCB4WtxF7wt0Kwk8onHCATKg",
      tiktok: "https://www.tiktok.com/@soliguide",
    },
    becomeVolunteerEnabled: true,
    contactFormEnabled: true,
    locationAutocompletePlaceholder:
      "Gare de l'est, 12 rue des bois, Paris, etc.",
    solidata: {
      territorialAnalysis: environment.territorialAnalysis,
      seasonalAnalysis: environment.seasonalAnalysis,
      searchTracking: environment.searchTracking,
      olympicGames: environment.olympicGames,
    },
    praticalFilesLink: environment.praticalFilesLink,
    becomeTranslatorFormLink: environment.becomeTranslatorFormLink,
    donateLink: environment.donateLink,
    proAccountCreationFormLink: environment.proAccountCreationFormLink,
    chatWebsiteId: environment.chatWebsiteId,
    territoriesStats: {
      territoriesPresent: Number.parseInt(environment.territoriesPresent),
    },
    showTranslationMenuDropdown: true,
    showSoligareMenu: true,
  },
  [Themes.SOLIGUIA_ES]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguia",
    logos: {
      inline: "soliguia-inline.svg",
      original: "soliguia.svg",
      symbol: "soliguide-symbol.svg",
      sponsor: "poctefa.webp",
    },
    country: CountryCodes.ES,
    defaultCoordinates: [2.176866769, 41.382625579], // Barcelona
    defaultLanguage: SupportedLanguagesCode.CA,
    suggestedLanguages: [SupportedLanguagesCode.CA, SupportedLanguagesCode.ES],
    helpEnabled: false,
    becomeVolunteerEnabled: false,
    contactFormEnabled: false,
    locationAutocompletePlaceholder: "Barcelona Sants, Lleida, etc.",
    showTranslationMenuDropdown: false,
    showSoligareMenu: false,
  },
  [Themes.SOLIGUIA_AD]: {
    ...DEFAULT_THEME_VALUE,
    brandName: "Soliguia",
    logos: {
      inline: "soliguia-inline.svg",
      original: "soliguia.svg",
      symbol: "soliguide-symbol.svg",
      sponsor: "poctefa.webp",
    },
    country: CountryCodes.AD,
    defaultCoordinates: [1.582188, 42.535812], // Andorra
    defaultLanguage: SupportedLanguagesCode.CA,
    suggestedLanguages: [
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
    ],
    helpEnabled: false,
    becomeVolunteerEnabled: false,
    contactFormEnabled: false,
    locationAutocompletePlaceholder:
      "Andorre-la-Vieja, Escaldes-Engordany, etc.",
    showTranslationMenuDropdown: false,
    showSoligareMenu: false,
  },
} as const;

const theme = themeService.getTheme();

initializeCategoriesByTheme(theme);

export const THEME_CONFIGURATION = THEMES[theme];
