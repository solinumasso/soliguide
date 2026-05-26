import { PlaceChangesSection } from "@soliguide/common";

import { param } from "express-validator";

export const campaignFormSection = param("section").isIn(
  Object.values(PlaceChangesSection)
);

export const orgaIdChecker = param("section").optional().exists().isInt();
