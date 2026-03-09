import { OTHER_DEFAULT_VALUES, WelcomedPublics } from "@soliguide/common";

import { body } from "express-validator";

export const otherDto = (path = "") => {
  return [
    body(path + "publics").customSanitizer((value) => {
      if (!value.accueil) {
        value.other = OTHER_DEFAULT_VALUES;
      }
      return value;
    }),

    body(path + "publics")
      .customSanitizer((value) => {
        value.other = value.other?.length ? [...new Set(value.other)] : [];
        return value;
      })
      .custom((value) => {
        if (
          value.accueil !== WelcomedPublics.UNCONDITIONAL &&
          value.other.length === 0
        ) {
          throw new Error("NO_OTHER_STATUS_SELECTED");
        }
        return true;
      }),

    body(path + "publics.other.*").custom((value) => {
      if (OTHER_DEFAULT_VALUES.indexOf(value) === -1) {
        throw new Error("WRONG_OTHER_STATUS");
      }
      return true;
    }),
  ];
};
