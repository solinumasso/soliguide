import {
  ApiPlace,
  CAMPAIGN_DEFAULT_NAME,
  CampaignChangesSection,
  CampaignPlaceAutonomy,
  CampaignSource,
  getDepartmentCodeFromPostalCode,
  PlaceChangesSection,
  PlaceStatus,
  Themes,
  type SoliguideCountries,
} from "@soliguide/common";

import express, { NextFunction } from "express";

import { ExpressRequest, ExpressResponse, ModelWithId } from "../../_models";
import { FRONT_URLS_MAPPINGS } from "../../_models/config/constants/domains/THEMES_MAPPING.const";

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

import { canEditPlace as canEditPlaceRights } from "../../user/controllers/user-rights.controller";
import { getPlaceByParams } from "../../place/services/place.service";
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
  updateAirConditionedForPlace,
  updateOrganizationCampaign,
} from "../controllers";
import { updatePlaceByPlaceId } from "../../place/services/admin-place.service";

const router = express.Router();

const getMagicLinkPlaceFromUrl = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const { lieu_id } = req.params;
  const params = /^\d+$/.test(lieu_id)
    ? { lieu_id: parseInt(lieu_id, 10) }
    : { seo_url: lieu_id };
  const lieu = await getPlaceByParams(params);
  if (!lieu) {
    return res.redirect(
      302,
      `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}?error=PLACE_NOT_FOUND`
    );
  }
  req.lieu = lieu;
  return next();
};

const canEditMagicLinkPlace = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const hasRights =
    req.user.isLogged() && (await canEditPlaceRights(req.user, req.lieu));
  if (!hasRights) {
    return res.redirect(
      302,
      `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}?error=NOT_AUTHORIZED`
    );
  }
  return next();
};

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
  getMagicLinkPlaceFromUrl,
  canEditMagicLinkPlace,
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
        // Magic link = fully autonomous action: always force AUTONOMOUS
        place = await updatePlaceByPlaceId(
          place.lieu_id,
          {
            [`campaigns.${CAMPAIGN_DEFAULT_NAME}.autonomy`]:
              CampaignPlaceAutonomy.AUTONOMOUS,
          },
          true,
          place.status
        );

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

      res.redirect(
        302,
        `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/campaign/fiche/${
          req.lieu.lieu_id
        }?nochange=true`
      );
      return next();
    } catch (e) {
      req.log.error(e, "MAGIC_LINK_NO_CHANGE_IMPOSSIBLE");
      return res.redirect(
        302,
        `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/campaign/fiche/${
          req.lieu.lieu_id
        }?nochange=true&error=MAGIC_LINK_NO_CHANGE_IMPOSSIBLE`
      );
    }
  },
  sendPlaceChangesToMq
);

// Magic link "air conditioned" for Brevo campaign emails
// GET /campaign/magic-link/air-conditioned/:lieu_id?token=<jwt>&airConditioned=true|false|null
router.get(
  "/magic-link/air-conditioned/:lieu_id",
  getCurrentUserFromQueryToken,
  setUserForLogs,
  handleAdminRight,
  getMagicLinkPlaceFromUrl,
  canEditMagicLinkPlace,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { airConditioned } = req.query;

    if (
      typeof airConditioned !== "string" ||
      !["true", "false", "null"].includes(airConditioned)
    ) {
      return res.redirect(
        302,
        `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/campaign/fiche/${
          req.lieu.lieu_id
        }?error=INVALID_AIR_CONDITIONED_ANSWER`
      );
    }

    const airConditionedValue =
      airConditioned === "null" ? null : airConditioned === "true";

    try {
      const { placeChanges, updatedPlace } = await updateAirConditionedForPlace(
        req.lieu,
        airConditionedValue,
        req.userForLogs
      );

      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;

      res.redirect(
        302,
        `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/campaign/fiche/${
          req.lieu.lieu_id
        }?airConditioned=${airConditioned}`
      );
      return next();
    } catch (e) {
      req.log.error(e, "MAGIC_LINK_AIR_CONDITIONED_IMPOSSIBLE");
      return res.redirect(
        302,
        `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/campaign/fiche/${
          req.lieu.lieu_id
        }?airConditioned=${airConditioned}&error=MAGIC_LINK_AIR_CONDITIONED_IMPOSSIBLE`
      );
    }
  },
  sendPlaceChangesToMq
);

export default router;
