import {
  CommonNewPlaceService,
  CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING,
  CategoriesSpecificFields,
  ServiceSaturation,
} from "@soliguide/common";

import { body } from "express-validator";

import { hoursDto } from "./hours.dto";
import { modalitiesDto } from "./modalities.dto";
import { publicsDto } from "./publics.dto";

import { stringDto } from "../../_utils/dto";
import { forceChangesDto } from "./forceChanges.dto";

import { startAndEndDateDto } from "../../temp-info/dto/start-and-end-date.dto";
import { Types } from "mongoose";
import { CHECK_STRING_NULL } from "../../config";
import { getServiceCategoriesApi } from "../../categories/functions/get-service-categories-api.function";
import { TypeCategoriesServiceNotFromThemeEnum } from "../../categories/enums/type-categories-service-not-from-theme.enum";

export const serviceObjectIdDto = body(
  "services_all.*.serviceObjectId"
).customSanitizer((value) => {
  return value ? new Types.ObjectId(value) : new Types.ObjectId();
});

export const categorySpecificFieldsDto = (path: string) =>
  body(path)
    .if(body(path).exists(CHECK_STRING_NULL))
    .isString()
    .trim()
    .isLength({ min: 3 });

// get all categories independently of the request's theme
const categoriesService = getServiceCategoriesApi(
  TypeCategoriesServiceNotFromThemeEnum.ALL
);

export const serviceCategoryDto = body("services_all.*.category")
  .exists(CHECK_STRING_NULL)
  .isIn(categoriesService.getCategoriesLeaf())
  .withMessage("The category does not exist");

export const servicesDto = [
  body("isCampaign").optional().exists().isBoolean(),

  body("services_all")
    .exists()
    .isArray()
    .customSanitizer((services: Partial<CommonNewPlaceService>[]) => {
      return services?.map((service) => {
        if (!service.createdAt && service.serviceObjectId) {
          service.createdAt = new Date(
            new Types.ObjectId(service.serviceObjectId).getTimestamp()
          );
        }

        return service;
      });
    }),

  serviceObjectIdDto,

  // Category and description
  body("services_all.*").custom((service: CommonNewPlaceService) => {
    if (service.category && service.categorySpecificFields) {
      for (const categorySpecificField of Object.keys(
        service.categorySpecificFields
      )) {
        if (
          CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[service.category] &&
          !CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[
            service.category
          ]?.includes(categorySpecificField as keyof CategoriesSpecificFields)
        ) {
          throw new Error(
            `The category specific field "${categorySpecificField}" doesn't exist`
          );
        }
      }
    }

    return true;
  }),

  categorySpecificFieldsDto(
    "services_all.*.categorySpecificFields.activityName"
  ),
  categorySpecificFieldsDto(
    "services_all.*.categorySpecificFields.mobilityAssistanceName"
  ),
  categorySpecificFieldsDto(
    "services_all.*.categorySpecificFields.wellnessActivityName"
  ),

  stringDto("services_all.*.description", false, 4000),

  // Opening hours
  body("services_all.*.differentHours").isBoolean(),
  body("services_all.*.hours")
    .if(body("services_all.*.differentHours").equals("false"))
    .customSanitizer((_, { req }) => req.lieu.newhours),
  body("services_all.*.hours").exists().isObject(),
  ...hoursDto("services_all.*.hours."),

  // Access conditions
  body("services_all.*.differentModalities").isBoolean(),
  body("services_all.*.modalities")
    .if(body("services_all.*.differentModalities").equals("false"))
    .customSanitizer((_, { req }) => {
      return { ...structuredClone(req.lieu.modalities), docs: [] };
    }),
  ...modalitiesDto("services_all.*."),

  // Welcomed publics
  body("services_all.*.differentPublics").isBoolean(),
  body("services_all.*.publics")
    .if(body("services_all.*.differentPublics").equals("false"))
    .customSanitizer((_, { req }) => req.lieu.publics),
  ...publicsDto("services_all.*."),

  // Saturation
  body("services_all.*.saturated").exists().isObject(),
  body("services_all.*.saturated.status")
    .isString()
    .isIn(Object.values(ServiceSaturation)),
  stringDto("services_all.*.saturated.precision", false, 4000),

  // Closing
  body("services_all.*.close.actif").exists().isBoolean(),
  body("services_all.*.close")
    .if(body("services_all.*.close.actif").equals("false"))
    .customSanitizer((value) => {
      return { ...value, dateDebut: null, dateFin: null };
    }),

  ...startAndEndDateDto("services_all.*.close"),
  ...forceChangesDto,
];
