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
// @deprecated: delete this function when the numbers are migrated on all aspects of the soliguide
// Special telephone numbers have a different format depending on the country, you cannot define a generic rule
export const parseSpecialPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  phoneNumber = phoneNumber.replace(/^\+33/, "0").replace(/\./g, "").trim();
  const chunks = [];
  while (phoneNumber.length > 0) {
    chunks.unshift(phoneNumber.slice(-2));
    phoneNumber = phoneNumber.slice(0, -2);
  }
  return chunks.join(" ");
};
