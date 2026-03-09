import { body } from "express-validator";

import {
  CampaignName,
  CampaignStatusForSearch,
  PlaceChangesSection,
  PlaceChangesStatus,
  PlaceType,
} from "@soliguide/common";

import { USER_STATUS } from "../../_models";

import { territoriesDto } from "../../_utils/dto/territories.dto";

import { searchOptionsDto } from "../../general/dto/searchOptions.dto";

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
