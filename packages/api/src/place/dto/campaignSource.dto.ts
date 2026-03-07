import { body } from "express-validator";

import { CampaignSource } from "@soliguide/common";

export const campaignSourceDto = [
  body("source").exists().isIn(Object.values(CampaignSource)),
];
