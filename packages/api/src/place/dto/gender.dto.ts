import { GENDER_DEFAULT_VALUES, WelcomedPublics } from "@soliguide/common";

import { body } from "express-validator";

export const genderDto = (path = "") => {
  return [
    body(path + "publics").customSanitizer((value) => {
      if (!value.accueil) {
        value.gender = GENDER_DEFAULT_VALUES;
      }
      return value;
    }),

    body(path + "publics")
      .customSanitizer((value) => {
        value.gender = value.gender?.length ? [...new Set(value.gender)] : [];
        return value;
      })
      .custom((value) => {
        if (
          value.accueil !== WelcomedPublics.UNCONDITIONAL &&
          value.gender.length === 0
        ) {
          throw new Error("NO_GENDER_SELECTED");
        }
        return true;
      }),

    body(path + "publics.gender.*").custom((value) => {
      if (GENDER_DEFAULT_VALUES.indexOf(value) === -1) {
        throw new Error("WRONG_GENDER");
      }
      return true;
    }),
  ];
};
