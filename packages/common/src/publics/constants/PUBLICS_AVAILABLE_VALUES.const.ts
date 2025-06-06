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
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "../enums";

export const ADMINISTRATIVE_DEFAULT_VALUES: PublicsAdministrative[] =
  Object.values(PublicsAdministrative).filter(
    (value: PublicsAdministrative) => value !== PublicsAdministrative.all
  );

export const FAMILY_DEFAULT_VALUES: PublicsFamily[] = Object.values(
  PublicsFamily
).filter((value: PublicsFamily) => value !== PublicsFamily.all);

export const GENDER_DEFAULT_VALUES: PublicsGender[] = Object.values(
  PublicsGender
).filter((value: PublicsGender) => value !== PublicsGender.all);

export const OTHER_DEFAULT_VALUES: PublicsOther[] = Object.values(
  PublicsOther
).filter((value: PublicsOther) => value !== PublicsOther.all);
