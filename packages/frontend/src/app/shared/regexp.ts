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

export const regexp = {
  date: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
  facebook:
    "(https?://)?([\\da-z.-]+\\.)?(facebook)\\.([a-z.]{2,6})[/\\w%@ %?#=&.-]*/?",

  htmlTag: /(<([^>]+)>)|(&nbsp;)/gi,
  instagram:
    "(https?://)?([\\da-z.-]+\\.)?(instagram)\\.([a-z.]{2,6})[/\\w %?#=&.-]*/?",

  postcode: /^[0-9][0-9AB][0-9]{3}$/,
};
