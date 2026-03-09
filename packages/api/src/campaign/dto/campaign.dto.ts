import { PlaceChangesSection } from "@soliguide/common";

import { param, body } from "express-validator";

import { isValidDate } from "../../_utils/functions/dates/date.functions";

export const campaignFormSection = param("section").isIn(
  Object.values(PlaceChangesSection)
);

export const orgaIdChecker = param("section").optional().exists().isInt();

export const remindMe = [
  body("date")
    .custom((value) => isValidDate(value))
    .customSanitizer((value) => new Date(value)),
];
