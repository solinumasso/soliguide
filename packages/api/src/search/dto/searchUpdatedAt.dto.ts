import { UpdatedAtInterval } from "@soliguide/common";

import { body } from "express-validator";

import { isValidDate } from "../../_utils/functions/dates/date.functions";

export const searchUpdatedAtDto = (path = "updatedAt") => [
  body(`${path}.intervalType`)
    .if((intervalType: UpdatedAtInterval) => intervalType)
    .isIn(Object.values(UpdatedAtInterval)),

  body(`${path}.value`)
    .if((value: Date) => value)
    .custom((value) => isValidDate(value))
    .customSanitizer((value) => {
      const givenStartDate = new Date(value);
      givenStartDate.setUTCHours(0, 0, 0);
      return givenStartDate;
    }),
];
