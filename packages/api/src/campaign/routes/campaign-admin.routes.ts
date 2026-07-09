import express from "express";

import { UserStatus } from "@soliguide/common";

import {
  canEditPlace,
  checkRights,
  getFilteredData,
  getOrgaFromUrl,
  getPlaceFromUrl,
  setUserForLogs,
} from "../../middleware";
import {
  airConditionedBody,
  campaignSlugParam,
  lieuIdParam,
} from "../dto/campaign-temp-forms.dto";
import {
  getActiveCampaigns,
  getCampaignTempFormsDataForOrga,
  patchCampaignTempFormsClimate,
} from "../controllers";
import { getActiveCampaignFromSlug } from "../middlewares/getActiveCampaignFromSlug.middleware";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";

const router = express.Router();

router.get(
  "/active",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  getActiveCampaigns
);

// Variante admin de `campaign-temp-forms` scopée par organisation :
// pas d'uuid public (le lien est utilisé depuis la page admin `manage-orga`).
// Auth = session admin (`checkRights`) + résolution orga via `getOrgaFromUrl`.
router.get(
  "/:campaignSlug/orga/:orgaObjectId/climate",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  campaignSlugParam,
  getFilteredData,
  getActiveCampaignFromSlug,
  getOrgaFromUrl,
  setUserForLogs,
  getCampaignTempFormsDataForOrga
);

router.patch(
  "/:campaignSlug/orga/:orgaObjectId/climate/places/:lieu_id",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  campaignSlugParam,
  lieuIdParam,
  airConditionedBody,
  getFilteredData,
  getActiveCampaignFromSlug,
  getOrgaFromUrl,
  setUserForLogs,
  getPlaceFromUrl,
  canEditPlace,
  patchCampaignTempFormsClimate,
  sendPlaceChangesToMq
);

export default router;
