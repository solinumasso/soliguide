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

import { SupportedLanguagesCode } from "../enums";
import { CountryCodes } from "../../location";
import { SupportedCountriesLanguages } from "..";

/**
 * !!! The country order is important !!!
 * The first country is the default country
 * The other countries are the other languages
 * The order is important because it reflects
 * the order of the languages in the UI
 */
export const SUPPORTED_LANGUAGES_BY_COUNTRY: SupportedCountriesLanguages = {
  [CountryCodes.FR]: {
    source: SupportedLanguagesCode.FR,
    otherLanguages: [
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.RU,
      SupportedLanguagesCode.PS,
      SupportedLanguagesCode.FA,
      SupportedLanguagesCode.UK,
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.KA,
      SupportedLanguagesCode.RO,
    ],
  },
  [CountryCodes.ES]: {
    source: SupportedLanguagesCode.CA,
    otherLanguages: [
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.UK,
    ],
  },
  [CountryCodes.AD]: {
    source: SupportedLanguagesCode.CA,
    otherLanguages: [
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.UK,
    ],
  },
};
