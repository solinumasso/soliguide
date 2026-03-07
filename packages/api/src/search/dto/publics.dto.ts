import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  SearchPublics,
  WelcomedPublics,
} from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const publicsDto = [
  body("publics.accueil")
    .if(body("publics.accueil").exists(CHECK_STRING_NULL))
    .isIn(Object.values(WelcomedPublics))
    .withMessage("WRONG_PUBLICS_WELCOMED_TYPE"),

  body("publics.age")
    .if(body("publics.age").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt()
    .custom((value) => {
      if (value >= 0) return true;
      else throw new Error("AGE_MUST_POSITIVE");
    })
    .customSanitizer((value) => {
      return Math.min(value, 99);
    }),

  body("publics.gender")
    .if((value: any) => value)
    .isArray()
    .custom((genders: PublicsGender[]) => {
      for (const gender of genders) {
        if (!Object.values(PublicsGender).includes(gender)) {
          throw new Error(`Gender ${gender} doesn't exist`);
        }
      }
      return true;
    }),
  body("publics.administrative")
    .if((value: any) => value)
    .isArray()
    .custom((administrativeSituations: PublicsAdministrative[]) => {
      for (const administrativeSituation of administrativeSituations) {
        if (
          !Object.values(PublicsAdministrative).includes(
            administrativeSituation
          )
        ) {
          throw new Error(
            `Administrative situation ${administrativeSituation} doesn't exist`
          );
        }
      }
      return true;
    }),
  body("publics.familialle")
    .if((value: any) => value)
    .isArray()
    .custom((familySituations: PublicsFamily[]) => {
      for (const familySituation of familySituations) {
        if (!Object.values(PublicsFamily).includes(familySituation)) {
          throw new Error(`Family situation ${familySituation} doesn't exist`);
        }
      }
      return true;
    }),
  body("publics.other")
    .if((value: any) => value)
    .isArray()
    .custom((otherSituations: PublicsOther[]) => {
      for (const otherSituation of otherSituations) {
        if (!Object.values(PublicsOther).includes(otherSituation)) {
          throw new Error(`Other situation ${otherSituation} doesn't exist`);
        }
      }
      return true;
    }),
  body("publics")
    .if((publics: SearchPublics) => publics)
    .customSanitizer((publics: SearchPublics) => {
      if (publics.gender?.includes(PublicsGender.all)) {
        delete publics.gender;
      }
      if (publics.administrative?.includes(PublicsAdministrative.all)) {
        delete publics.administrative;
      }
      if (publics.familialle?.includes(PublicsFamily.all)) {
        delete publics.familialle;
      }
      if (publics.other?.includes(PublicsOther.all)) {
        delete publics.other;
      }
      return publics;
    }),
];
