import {
  AdminSearchFilterOrganization,
  CampaignPlaceAutonomy,
  CampaignSource,
  PlaceVisibility,
  CampaignStatusForSearch,
  SearchFilterClosure,
  SearchPlaceStatus,
} from "@soliguide/common";

import { body } from "express-validator";

import { categoriesToExcludeDto, categoryDto } from "./categories.dto";
import { searchLocationsDto } from "./searchLocations.dto";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

import { searchOptionsDto } from "../../general/dto/searchOptions.dto";
import { placeTypeDto } from "./placeType.dto";
import { searchUpdatedAtDto } from "./searchUpdatedAt.dto";
import { textSearchDto } from "./text-search.dto";
import { countryDto } from "../../_utils/dto";

export const searchAdminDto = [
  ...searchLocationsDto(),
  ...searchOptionsDto,
  ...categoryDto,
  ...categoriesToExcludeDto,
  ...countryDto,
  ...placeTypeDto,
  ...searchUpdatedAtDto("updatedByUserAt"),
  ...textSearchDto("word"),

  body("autonomy")
    .if(body("autonomy").exists(CHECK_STRING_NULL))
    .isArray()
    .custom((autonomy) => {
      for (const aut of autonomy) {
        if (!CampaignPlaceAutonomy[aut as CampaignPlaceAutonomy]) {
          throw new Error(`${aut.toUpperCase()}_DOES_NOT_EXIST`);
        }
      }
      return true;
    })
    .customSanitizer((autonomy) => {
      return [...new Set(autonomy)];
    }),

  body("campaignStatus")
    .if(body("campaignStatus").exists(CHECK_STRING_NULL))
    .isIn(Object.values(CampaignStatusForSearch)),

  body("close")
    .if(body("close").exists(CHECK_STRING_NULL))
    .isIn(Object.values(SearchFilterClosure)),

  body("lieu_id")
    .if(body("lieu_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),

  body("organization")
    .if(body("organization").exists(CHECK_STRING_NULL))
    .isIn(Object.values(AdminSearchFilterOrganization)),

  body("options.sortBy")
    .if(body("options.sortBy").exists(CHECK_STRING_NULL))
    .isIn([
      "autonomy",
      "createdAt",
      "campaignStatus",
      "distance",
      "organizations.name",
      "lieu_id",
      "name",
      "priority",
      "slugs.infos.name",
      "sourceMaj",
      "status",
      "updatedByUserAt",
      "visibility",
    ]),

  body("priority").if(body("priority").exists(CHECK_STRING_NULL)).isBoolean(),

  body("sourceMaj").if(
    body("sourceMaj")
      .exists(CHECK_STRING_NULL)
      .isIn(Object.values(CampaignSource))
  ),

  body("status")
    .if(body("status").exists(CHECK_STRING_NULL))
    .isIn(Object.values(SearchPlaceStatus)),

  body("visibility")
    .if(body("visibility").exists(CHECK_STRING_NULL))
    .isIn(Object.values(PlaceVisibility)),
];

export const searchAdminForOrgasDto = [
  ...searchOptionsDto,
  ...placeTypeDto,
  ...textSearchDto("word"),
  ...countryDto,
  body("lieu_id")
    .if(body("lieu_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),
];
