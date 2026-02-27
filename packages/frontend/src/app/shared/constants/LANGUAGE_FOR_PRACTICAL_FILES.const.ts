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
import { SupportedLanguagesCode } from "@soliguide/common";

export const LANGUAGE_FOR_PRACTICAL_FILES: Record<
  SupportedLanguagesCode,
  string
> = {
  [SupportedLanguagesCode.FR]: SupportedLanguagesCode.FR,
  [SupportedLanguagesCode.AR]: SupportedLanguagesCode.AR,
  [SupportedLanguagesCode.CA]: SupportedLanguagesCode.ES,
  [SupportedLanguagesCode.EN]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.ES]: SupportedLanguagesCode.ES,
  [SupportedLanguagesCode.FA]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.KA]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.PS]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.PT]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.RO]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.RU]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.UK]: `${SupportedLanguagesCode.EN}-us`,
};
