import { RELATIONS, USER_TYPES, CampaignStatus } from "@soliguide/common";

import { searchOptionsDto } from "../../general/dto/searchOptions.dto";
import { body } from "express-validator";

import { territoriesDto } from "../../_utils/dto/territories.dto";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const searchOrgasDto = [
  body("campaignStatus")
    .if(body("campaignStatus").exists(CHECK_STRING_NULL))
    .isIn(Object.values(CampaignStatus)),

  body("lieu_id")
    .if(body("lieu_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),

  body("organization_id")
    .if(body("organization_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),

  body("name").if(body("name").exists(CHECK_STRING_NULL)).isString().trim(),

  // TODO remove NONE once the relationships will be filled out
  body("relations")
    .isArray()
    .if(body("relations").notEmpty())
    .custom((relations) => {
      for (const relation of relations) {
        if (![...RELATIONS, "NO_RELATION"].includes(relation)) {
          throw new Error("WRONG_RELATION");
        }
      }
      return true;
    }),

  body("userTypes")
    .isArray()
    .if(body("userTypes").notEmpty())
    .custom((userTypes) => {
      for (const userType of userTypes) {
        if (!USER_TYPES.includes(userType)) {
          throw new Error("WRONG_RELATION");
        }
      }
      return true;
    }),

  body("priority").if(body("priority").exists(CHECK_STRING_NULL)).isBoolean(),

  body("options.sortBy")
    .if(body("options.sortBy").exists(CHECK_STRING_NULL))
    .isIn([
      "autonomyRate",
      "campaignStatus",
      "createdAt",
      "invitations",
      "mail",
      "name",
      "organization_id",
      "territories",
      "users",
      "priority",
      "places",
    ]),

  ...searchOptionsDto,
  ...territoriesDto,
];
