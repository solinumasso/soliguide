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
import { body } from "express-validator";

const addHttpsIfNeeded = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
};

export const checkUrlFieldDto = (urlField: string) =>
  body(urlField)
    .if((value: string) => value)
    .trim()
    .customSanitizer(addHttpsIfNeeded)
    .custom((value) => {
      const regex = new RegExp(
        /^(https?:\/\/)?([a-z0-9ç-]+\.)+[a-zç]{2,6}(\/[\w %?#=&.-]*)*\/?$/i
      );

      if (!regex.test(value)) {
        throw new Error("Invalid URL format");
      }
      return true;
    });
