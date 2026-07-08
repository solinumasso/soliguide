import express from "express";

import { UserStatus } from "@soliguide/common";

import { getActiveCampaigns } from "../controllers/campaign-admin.controller";
import { checkRights } from "../../middleware";

const router = express.Router();

router.get(
  "/active",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  getActiveCampaigns
);

export default router;
