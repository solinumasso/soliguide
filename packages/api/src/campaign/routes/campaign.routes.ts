/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApiPlace,
  CampaignChangesSection,
  CountryCodes,
  getDepartmentCodeFromPostalCode,
  PlaceChangesSection,
  PlaceStatus,
} from "@soliguide/common";

import express, { NextFunction } from "express";

import { ExpressRequest, ExpressResponse, ModelWithId } from "../../_models";

import {
  getFilteredData,
  getPlaceFromUrl,
  canEditPlace,
  getOrgaFromUrl,
  canGetOrga,
} from "../../middleware";

import { saveTempChanges } from "../../place-changes/controllers/place-changes.controller";
import { campaignFormSection, remindMe } from "../dto/campaign.dto";
import { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";
import {
  computePlaceAutonomyStatus,
  getPlaces,
  isCampaignActive,
  setNoChangeForPlace,
  setRemindMeLater,
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

// Specify an update reminder
router.post(
  "/remind-me/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  remindMe,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { date } = req.bodyValidated;

    try {
      const place = await setRemindMeLater(req.lieu, date, req.userForLogs);

      saveTempChanges(
        PlaceChangesSection.remindMe,
        req.lieu,
        place,
        req.userForLogs,
        true,
        true
      );

      req.updatedPlace = place;
      res.status(200).json(place);

      return next();
    } catch (e) {
      req.log.error(e);
      return res.status(500).json("REMINDE_ME_IMPOSSIBLE");
    }
  },
  sendPlaceChangesToMq
);

router.get(
  "/isCampaignOnTerritory/place/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  (req: ExpressRequest, res: ExpressResponse) => {
    const territory = getDepartmentCodeFromPostalCode(
      CountryCodes.FR,
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

export default router;
