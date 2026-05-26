import {
  ApiPlace,
  CampaignChangesSection,
  CampaignSource,
  getDepartmentCodeFromPostalCode,
  PlaceChangesSection,
  PlaceStatus,
  type SoliguideCountries,
} from "@soliguide/common";

import express, { NextFunction } from "express";

import {
  CONFIG,
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
} from "../../_models";

import {
  getCurrentUserFromQueryToken,
  getFilteredData,
  getPlaceFromUrl,
  handleAdminRight,
  canEditPlace,
  getOrgaFromUrl,
  canGetOrga,
  setUserForLogs,
} from "../../middleware";

import { saveTempChanges } from "../../place-changes/controllers/place-changes.controller";
import { campaignFormSection } from "../dto/campaign.dto";
import { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";
import {
  computePlaceAutonomyStatus,
  getPlaces,
  isCampaignActive,
  setNoChangeForPlace,
  updateCampaignSection,
  updateOrganizationCampaign,
} from "../controllers";

const router = express.Router();

// No-changes on the place
router.get(
  "/no-change/:lieu_id/:section?",
  getPlaceFromUrl,
  canEditPlace,
  campaignFormSection,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const section: CampaignChangesSection | PlaceChangesSection.place =
      req.bodyValidated.section;

    let place: ModelWithId<ApiPlace>;
    let placeChanges!: PlaceChanges;

    try {
      if (section !== PlaceChangesSection.place) {
        place = await updateCampaignSection(req.lieu, section, false);
      } else {
        place = await setNoChangeForPlace(req.lieu.lieu_id, req.lieu.status);
      }

      if (req.userForLogs && place) {
        place = await computePlaceAutonomyStatus(place, req.userForLogs);

        await updateOrganizationCampaign(place._id);

        if (section === PlaceChangesSection.place) {
          for (const sectionToUpdate of [
            PlaceChangesSection.tempClosure,
            PlaceChangesSection.tempHours,
            PlaceChangesSection.services,
            PlaceChangesSection.tempMessage,
          ]) {
            placeChanges = await saveTempChanges(
              sectionToUpdate,
              req.lieu,
              place,
              req.userForLogs,
              true,
              true
            );
          }
        } else {
          placeChanges = await saveTempChanges(
            section,
            req.lieu,
            place,
            req.userForLogs,
            true,
            true
          );
        }

        req.updatedPlace = place;
        req.placeChanges = placeChanges;
      }
      res.status(200).json(place);
      return next();
    } catch (e) {
      const errorTitle =
        section === PlaceChangesSection.place
          ? "UPDATE_PLACE_IMPOSSIBLE"
          : "UPDATE_SECTION_IMPOSSIBLE";
      req.log.error(e, errorTitle);
      return res.status(500).json(errorTitle);
    }
  },
  sendPlaceChangesToMq
);

router.get(
  "/places/:orgaObjectId?",
  getOrgaFromUrl,
  canGetOrga,
  (req: ExpressRequest, res: ExpressResponse) => {
    const places = getPlaces(req.user, req.organization, req.isAdmin ?? false);
    return res.status(200).json(places);
  }
);

router.get(
  "/isCampaignOnTerritory/place/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  (req: ExpressRequest, res: ExpressResponse) => {
    const territory = getDepartmentCodeFromPostalCode(
      req.lieu.country as SoliguideCountries,
      req.lieu.postalCode
    );

    if (isCampaignActive(req.user?.territories)) {
      if (
        isCampaignActive([territory]) &&
        req.lieu.status === PlaceStatus.ONLINE
      ) {
        return res.status(200).json(true);
      }
    }

    return res.status(403).json("ACCESS_DENIED");
  }
);

router.get(
  "/isCampaignOnTerritory/orga/:orga_id",
  getOrgaFromUrl,
  (req: ExpressRequest, res: ExpressResponse) => {
    if (
      req.isSuperAdmin ||
      (isCampaignActive(req.user.territories) &&
        isCampaignActive(req.organization.territories))
    ) {
      return res.status(200).json(true);
    }
    return res.status(403).json("ACCESS_DENIED");
  }
);

router.get(
  "/isCampaignOnTerritory/user/:user_id",
  (req: ExpressRequest, res: ExpressResponse) => {
    if (req.isSuperAdmin || isCampaignActive(req.user?.territories)) {
      return res.status(200).json(true);
    }

    return res.status(403).json("ACCESS_DENIED");
  }
);

// Magic link "no changes" for Brevo campaign emails
// GET /campaign/magic-link/no-change/:lieu_id?token=<jwt>
router.get(
  "/magic-link/no-change/:lieu_id",
  getCurrentUserFromQueryToken,
  setUserForLogs,
  handleAdminRight,
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    let place: ModelWithId<ApiPlace>;
    let placeChanges!: PlaceChanges;

    try {
      place = await setNoChangeForPlace(
        req.lieu.lieu_id,
        req.lieu.status,
        CampaignSource.EMAILS_AUTOMATIQUES
      );

      if (req.userForLogs && place) {
        place = await computePlaceAutonomyStatus(place, req.userForLogs);

        await updateOrganizationCampaign(place._id);

        for (const sectionToUpdate of [
          PlaceChangesSection.tempClosure,
          PlaceChangesSection.tempHours,
          PlaceChangesSection.services,
          PlaceChangesSection.tempMessage,
        ]) {
          placeChanges = await saveTempChanges(
            sectionToUpdate,
            req.lieu,
            place,
            req.userForLogs,
            true,
            true
          );
        }

        req.updatedPlace = place;
        req.placeChanges = placeChanges;
      }

      res.redirect(302, `${CONFIG.FRONTEND_URL}/campagne`);
      return next();
    } catch (e) {
      req.log.error(e, "MAGIC_LINK_NO_CHANGE_IMPOSSIBLE");
      return res.redirect(
        302,
        `${CONFIG.FRONTEND_URL}/campagne?error=MAGIC_LINK_NO_CHANGE_IMPOSSIBLE`
      );
    }
  },
  sendPlaceChangesToMq
);

export default router;
