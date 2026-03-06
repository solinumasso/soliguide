import { GeoTypes, SOLIGUIDE_COUNTRIES, UserStatus } from "@soliguide/common";
import { body } from "express-validator";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { stringDto } from "../../_utils/dto";

export const searchLocationsDto = (prefix = "location.") => {
  return [
    // TODO: add address from location-api, sent by frontend
    body(`${prefix}geoType`)
      .exists()
      .customSanitizer((value?: string | null) => {
        return !value ? GeoTypes.UNKNOWN : value;
      })
      .isIn(Object.values(GeoTypes)),

    body(`${prefix}geoValue`)
      .if(
        body(`${prefix}geoType`).custom(
          (value: string) =>
            value !== GeoTypes.POSITION && value !== GeoTypes.UNKNOWN
        )
      )
      .exists(CHECK_STRING_NULL),

    body(`${prefix}coordinates`)
      .if(body(`${prefix}geoType`).equals(GeoTypes.POSITION))
      .exists(CHECK_STRING_NULL)
      .notEmpty(),

    body(`${prefix}distance`)
      .if(body(`${prefix}geoType`).equals(GeoTypes.POSITION))
      .if((value: any) => value)
      .isNumeric(),

    body(`${prefix}label`).if((value: string) => value),

    stringDto(`${prefix}department`, false),
    stringDto(`${prefix}regionCode`, false),
    stringDto(`${prefix}departmentCode`, false),
    stringDto(`${prefix}region`, false),

    body(`${prefix}country`)
      .if(({ req }) => req.user.status !== UserStatus.API_USER)
      .custom((value: any) => {
        if (SOLIGUIDE_COUNTRIES.includes(value)) {
          return value;
        }
        throw new Error("COUNTRY_NOT_AVAILABLE");
      }),
  ];
};
