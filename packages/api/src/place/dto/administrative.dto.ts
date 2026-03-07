import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  WelcomedPublics,
} from "@soliguide/common";

import { body } from "express-validator";

export const administrativeDto = (path = "") => {
  return [
    body(path + "publics").customSanitizer((value) => {
      if (!value.accueil) {
        value.administrative = ADMINISTRATIVE_DEFAULT_VALUES;
      }
      return value;
    }),

    body(path + "publics")
      .customSanitizer((value) => {
        value.administrative = value.administrative?.length
          ? [...new Set(value.administrative)]
          : [];
        return value;
      })
      .custom((value) => {
        if (
          value.accueil !== WelcomedPublics.UNCONDITIONAL &&
          value.administrative.length === 0
        ) {
          throw new Error("NO_ADMINISTRATIVE_STATUS_SELECTED");
        }
        return true;
      }),

    body(path + "publics.administrative.*").custom((value) => {
      if (ADMINISTRATIVE_DEFAULT_VALUES.indexOf(value) === -1) {
        throw new Error("WRONG_ADMINISTRATIVE_STATUS");
      }
      return true;
    }),
  ];
};
