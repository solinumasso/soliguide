import { FAMILY_DEFAULT_VALUES, WelcomedPublics } from "@soliguide/common";

import { body } from "express-validator";

export const familyDto = (path = "") => {
  return [
    body(path + "publics").customSanitizer((value) => {
      if (!value.accueil) {
        value.familialle = structuredClone(FAMILY_DEFAULT_VALUES);
      }
      return value;
    }),
    body(path + "publics")
      .customSanitizer((value) => {
        value.familialle = value.familialle?.length
          ? [...new Set(value.familialle)]
          : [];
        return value;
      })
      .custom((value) => {
        if (
          value.accueil !== WelcomedPublics.UNCONDITIONAL &&
          value.familialle.length === 0
        ) {
          throw new Error("NO_FAMILY_STATUS_SELECTED");
        }
        return true;
      }),

    body(path + "publics.familialle.*").custom((value) => {
      if (FAMILY_DEFAULT_VALUES.indexOf(value) === -1) {
        throw new Error("WRONG_FAMILY_STATUS");
      }
      return true;
    }),
  ];
};
