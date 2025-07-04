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
import { PlaceType, TempInfoType } from "@soliguide/common";

import { body, param } from "express-validator";

import {
  checkTempInfoIntervalDto,
  startAndEndDateDto,
} from "./start-and-end-date.dto";

import {
  parseObjectIdOptionalDto,
  parseServiceObjectIdDto,
} from "../../_utils/dto/validObjectId.dto";

import { checkDays } from "../../place/dto/hours.dto";

export const baseTempInfoDto = [
  ...checkTempInfoIntervalDto,
  ...parseObjectIdOptionalDto,
  ...startAndEndDateDto(""),

  // Check if closure is in services
  ...parseServiceObjectIdDto,

  body("isCampaign")
    .if((value: string) => value)
    .isBoolean(),

  // 'description' always required except during campaign
  body("description")
    .custom((value: string, { req }) => {
      if (
        (!req.body.isCampaign &&
          req.params?.tempInfoType !== TempInfoType.HOURS) ||
        (req.body.isCampaign &&
          req.params?.tempInfoType === TempInfoType.MESSAGE)
      ) {
        return 5 <= value.trim().length && value.trim().length <= 4000;
      }
      return true;
    })
    .customSanitizer((value: string) => {
      if (value) {
        return value.trim();
      }
      return null;
    }),

  // 'name' required for temporary message only
  body("name")
    .custom((value: string, { req }) => {
      if (req.params?.tempInfoType === TempInfoType.MESSAGE) {
        return value.trim().length > 0;
      }
      return true;
    })
    .customSanitizer((value, { req }) => {
      if (req.params?.tempInfoType === TempInfoType.MESSAGE) {
        return value.trim();
      }
      return null;
    }),

  ...checkDays("hours.", PlaceType.PLACE, true),
];

export const tempInfoInServicesDto = [
  body("*.actif").isBoolean(),
  body("*")
    .if(body("*.actif").equals("false"))
    .customSanitizer((value) => {
      return { ...value, dateDebut: null, dateFin: null };
    }),
  ...startAndEndDateDto("*"),
  body("isCampaign")
    .if((value: string) => value)
    .isBoolean(),
];

export const tempInfoUrlParamDto = [
  param("tempInfoType").isIn(Object.values(TempInfoType)),
];
