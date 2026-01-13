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

import {
  CampaignName,
  CampaignStatusForSearch,
  PlaceChangesSection,
  PlaceChangesStatus,
  PlaceType,
} from "@soliguide/common";

import { territoriesDto } from "../../_utils/dto/territories.dto";
import { searchOptionsDto } from "../../general/dto/searchOptions.dto";
import { USER_STATUS } from "../../user/constants";

const checkOptionalId = (path: string) =>
  body(path)
    .if((value: string) => parseInt(value, 10) >= 0)
    .isInt({ allow_leading_zeroes: true, min: 0 });

const checkOptionalEnum = (path: string, enumObject: any[]) =>
  body(path)
    .if((value: string) => value)
    .isIn(enumObject);

export const searchPlaceChangesDto = [
  ...searchOptionsDto,

  ...territoriesDto,

  checkOptionalEnum("campaignName", Object.values(CampaignName)),

  checkOptionalEnum("campaignStatus", Object.values(CampaignStatusForSearch)),

  body("isCampaign")
    .if((value: string) => value)
    .isBoolean(),

  checkOptionalId("lieu_id"),

  checkOptionalEnum("options.sortBy", [
    "campaignName",
    "campaignStatus",
    "createdAt",
    "isCampaign",
    "lieu_id",
    "section",
    "status",
    "updatedAt",
    "userData.email",
    "userData.orgaId",
    "userData.orgaName",
    "userData.status",
  ]),

  checkOptionalEnum("placeType", Object.values(PlaceType)),

  checkOptionalEnum("section", Object.values(PlaceChangesSection)),

  checkOptionalEnum("status", Object.values(PlaceChangesStatus)),

  body("userData.email").if((value: string) => value),

  body("userData.orgaName").if((value: string) => value),

  checkOptionalEnum("userData.status", USER_STATUS),

  checkOptionalId("userData.orgaId"),
];
