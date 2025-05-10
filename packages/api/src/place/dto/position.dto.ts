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
import { CountryCodes } from "@soliguide/common";
import { body } from "express-validator";

import { stringDto } from "../../_utils/dto";

export const coordinatesDto = (path = "") => [
  body(path).isArray(),
  body(`${path}.*`)
    .isFloat()
    .custom((value) => {
      return value > -90 && value < 90;
    }),
];

export const postalCodeDto = (path = "") =>
  body(path).isString().trim().toUpperCase();

export const positionDto = (path = "") => [
  stringDto(`${path}address`),
  stringDto(`${path}additionalInformation`, false, 300),
  stringDto(`${path}country`, false),
  stringDto(`${path}city`),
  postalCodeDto(`${path}postalCode`),
  stringDto(`${path}cityCode`, false),
  stringDto(`${path}department`),
  stringDto(`${path}regionCode`),
  stringDto(`${path}departmentCode`),
  stringDto(`${path}region`),
  stringDto(`${path}timeZone`, false),
  body(`${path}country`).exists().isIn(Object.values(CountryCodes)),
  body(`${path}location.type`)
    .if((value: any) => value)
    .isString(),
  ...coordinatesDto(`${path}location.coordinates`),
];
