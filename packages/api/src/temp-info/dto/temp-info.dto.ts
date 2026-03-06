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
