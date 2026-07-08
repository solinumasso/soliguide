import express from "express";

import {
  canEditPlace,
  getFilteredData,
  getPlaceFromUrl,
  setUserForLogs,
} from "../../middleware";
import {
  airConditionedBody,
  campaignSlugParam,
  campaignUserUuidParam,
  lieuIdParam,
} from "../dto/campaign-temp-forms.dto";
import {
  getCampaignTempFormsData,
  patchCampaignTempFormsClimate,
} from "../controllers/campaign-temp-forms.controller";
import { getActiveCampaignFromSlug } from "../middlewares/getActiveCampaignFromSlug.middleware";
import { getUserFromCampaignUuid } from "../middlewares/getUserFromCampaignUuid.middleware";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";

// Routes publiques (aucune session, aucun cookie) : l'accès est borné par le
// couple (`campaignSlug`, `campaignUserUuid`) distribué par email Brevo.
// Chaque route enchaîne :
//   1. DTO express-validator + `getFilteredData`
//   2. résolution campagne ACTIVE → `req.campaign`
//   3. résolution user PRO via uuid → `req.user` (LOGGED) + `userRights`
//   4. `setUserForLogs` → `req.userForLogs` (Sentry + traces placeChanges)
//   5. (PATCH) résolution du lieu + garde-fou `canEditPlace` du core.
const router = express.Router();

router.get(
  "/:campaignSlug/:campaignUserUuid",
  campaignSlugParam,
  campaignUserUuidParam,
  getFilteredData,
  getActiveCampaignFromSlug,
  getUserFromCampaignUuid,
  setUserForLogs,
  getCampaignTempFormsData
);

router.patch(
  "/:campaignSlug/:campaignUserUuid/places/:lieu_id/climate",
  campaignSlugParam,
  campaignUserUuidParam,
  lieuIdParam,
  airConditionedBody,
  getFilteredData,
  getActiveCampaignFromSlug,
  getUserFromCampaignUuid,
  setUserForLogs,
  getPlaceFromUrl,
  canEditPlace,
  patchCampaignTempFormsClimate,
  sendPlaceChangesToMq
);

export default router;
