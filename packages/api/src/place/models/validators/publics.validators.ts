
import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
} from "@soliguide/common";

export const administrativeSituationsValidator = {
  validator: (administrativeSituations: any) =>
    !administrativeSituations ||
    (Array.isArray(administrativeSituations) &&
      (administrativeSituations as Array<any>).every(
        (administrativeSituation) =>
          ADMINISTRATIVE_DEFAULT_VALUES.includes(administrativeSituation)
      )),
  message: "Path {PATH} is not a list of valid administrative situations",
};

export const familySituationsValidator = {
  validator: (familySituations: any) =>
    !familySituations ||
    (Array.isArray(familySituations) &&
      (familySituations as Array<any>).every((familySituation) =>
        FAMILY_DEFAULT_VALUES.includes(familySituation)
      )),
  message: "Path {PATH} is not a list of valid family situations",
};

export const gendersValidator = {
  validator: (genders: any) =>
    !genders ||
    (Array.isArray(genders) &&
      (genders as Array<any>).every((gender) =>
        GENDER_DEFAULT_VALUES.includes(gender)
      )),
  message: "Path {PATH} is not a list of valid genders",
};

export const otherSituationsValidator = {
  validator: (otherSituations: any) =>
    !otherSituations ||
    (Array.isArray(otherSituations) &&
      (otherSituations as Array<any>).every((otherSituation) =>
        OTHER_DEFAULT_VALUES.includes(otherSituation)
      )),
  message: "Path {PATH} is not a list of valid other situations",
};
