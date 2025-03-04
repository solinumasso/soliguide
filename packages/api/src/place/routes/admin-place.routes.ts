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
import express, { NextFunction } from "express";

import {
  ApiPlace,
  UserStatus,
  updateServicesWithLegacyCategories,
} from "@soliguide/common";

import {
  campaignSourceDto,
  checkDuplicatesByAddressAndPlaceIdDto,
  dateDto,
  hoursDto,
  infoDto,
  modalitiesDto,
  parcoursDto,
  positionDto,
  publicsDto,
  servicesDto,
  sourceDto,
  statusDto,
  userContactDto,
  visibilityDto,
} from "../dto";

import {
  AirtableEntityType,
  ExpressRequest,
  ExpressResponse,
  UserForLogs,
} from "../../_models";

import { syncEntityDeletion } from "../../airtable/controllers/airtable.controller";
import { setEntityExcludedOrNotAndNext } from "../../airtable/services/airtableEntity.service";

import {
  checkRights,
  getFilteredData,
  canAddPlace,
  canDeletePlace,
  canEditPlace,
  getPlaceFromUrl,
  canGetOrga,
  getOrgaFromUrl,
  handleLanguage,
} from "../../middleware";

import { setObsoletePlaceChanges } from "../../place-changes/controllers/place-changes.controller";
import { rebuildTempServiceClosure } from "../../temp-info/controllers/temp-service-closure.controller";
import { generateElementsToTranslate } from "../../translations/controllers/translation.controller";
import {
  checkDuplicatesByAddressAndPlaceId,
  checkInOrga,
  patchPosition,
  patchContacts,
  patchPhotos,
  patchStatus,
  patchVisibility,
  patchModalities,
  patchServices,
  setNoChangeForPlace,
  duplicatePlace,
  deletePlace,
  patchParcours,
  patchCampaignSource,
  addPlace,
  patchHours,
  patchInfos,
  patchPublics,
  patchUpdateDate,
  putSource,
  deleteSource,
} from "../controllers";

import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";

const router = express.Router();

router.post(
  "/check-duplicates/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  checkDuplicatesByAddressAndPlaceIdDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const data = await checkDuplicatesByAddressAndPlaceId(
        req.lieu.lieu_id,
        req.bodyValidated.address,
        req.bodyValidated.postalCode
      );
      return res.status(200).json(data);
    } catch (err) {
      req.log.error(err, "TEST_DUPLICATE_FAILED");
    }
    return res.status(400).json({ message: "TEST_DUPLICATE_FAILED" });
  }
);

/**
 * @swagger
 *
 * /admin/places/check-in-orga/{id}:
 *   post:
 *     description: Check whether a place is in an organization
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Boolean
 *       403:
 *         description: FORBIDDEN
 *       400:
 *         description: BAD_REQUEST
 */
router.get(
  "/check-in-orga/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const isInOrga = await checkInOrga(req.lieu._id);
      return res.status(200).json(isInOrga);
    } catch (err) {
      return res.status(400).json({ message: "TEST_IN_ORGA_FAIL" });
    }
  }
);

/**
 * @swagger
 * tags:
 *   name: FormPlace
 *   description: All routes related to add and edit a place
 */
router.get(
  "/:lieu_id/:lang?",
  getPlaceFromUrl,
  canEditPlace,
  handleLanguage,
  (req: ExpressRequest, res: ExpressResponse) => {
    // Remove this comment
    return res.status(200).json(req.lieu);
  }
);

/**
 * @swagger
 *
 * /admin/places/infos/:
 *   post:
 *     description: creation fiche place
 *     tags: [FormPlace]
 *     parameters:
 *       - name: name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         in: formData
 *         required: true
 *         type: string
 *       - name: address
 *         in: formData
 *         required: true
 *         type: string
 *       - name: location
 *         in: formData
 *         required: true
 *         type: object
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 *       400:
 *         description: BAD_REQUEST
 */
router.post(
  ["/infos", "/infos/:orgaObjectId"],
  canAddPlace,
  (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    if (req.params.orgaObjectId) {
      return getOrgaFromUrl(req, res, next);
    }
    next();
  },
  (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    if (req.params.orgaObjectId) {
      return canGetOrga(req, res, next);
    }
    next();
  },
  infoDto(),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await addPlace(
        req.bodyValidated,
        req.userForLogs as UserForLogs,
        req.user,
        req.isAdmin ?? false,
        req.organization
      );

      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.updatedPlace = updatedPlace;
      req.airtableEntityType = AirtableEntityType.PLACE;
      res.status(200).json(updatedPlace);
      next();
    } catch (e) {
      req.log.error(e);
      return res.status(400).json({ message: "CREATE_PLACE_IMPOSSIBLE" });
    }
  },
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/infos/{id}:
 *   patch:
 *     description: edit general information
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/infos/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  infoDto(),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchInfos(
        req,
        req.bodyValidated
      );
      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_INFO_IMPOSSIBLE");
      return res.status(400).json({ message: "PATCH_INFO_IMPOSSIBLE" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

router.patch(
  "/position/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  positionDto(),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchPosition(
        req,
        req.bodyValidated
      );
      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_POSITION_IMPOSSIBLE");
      return res.status(400).json({ message: "PATCH_POSITION_IMPOSSIBLE" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/contacts/{id}:
 *   patch:
 *     description: edit a place contacts
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/contacts/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  userContactDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { placeChanges, updatedPlace } = await patchContacts(req);
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;
      res.status(200).json(updatedPlace);
    } catch (e) {
      req.log.error(e, "PATCH_CONTACTS_FAIL");
      return res.status(400).json({ message: "PATCH_CONTACTS_FAIL" });
    }
  },
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/photos/{id}:
 *   patch:
 *     description: edit pictures
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/photos/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { placeChanges, updatedPlace } = await patchPhotos(req);
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;
      res.status(200).json(updatedPlace);
    } catch (e) {
      req.log.error(e, "ADD_PHOTOS_FAIL");
      return res.status(400).json({ message: "ADD_PHOTOS_FAIL" });
    }
  },
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/status/{id}:
 *   patch:
 *     description: edit status
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/status/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  statusDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchStatus(req);
      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_STATUS_ERROR");
      return res.status(400).json({ message: "PATCH_STATUS_ERROR" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/visibility/{id}:
 *   patch:
 *     description: visibility edit
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/visibility/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  visibilityDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchVisibility(req);
      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_PRO_ONLY_ERROR");
      return res.status(400).json({ message: "PATCH_PRO_ONLY_ERROR" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/hours/{id}:
 *   patch:
 *     description: edit opening hours
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/hours/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  hoursDto(),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchHours(req);
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_HOURS_FAIL");
      return res.status(400).json({ message: "PATCH_HOURS_FAIL" });
    }
  },
  generateElementsToTranslate,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/publics/{id}:
 *   patch:
 *     description: welcomed publics edit
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/publics/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  publicsDto(""),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      delete req.bodyValidated[""];

      const { placeChanges, updatedPlace } = await patchPublics(req);
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_PUBLICS_FAIL");
      return res.status(400).json({ message: "PATCH_PUBLICS_FAIL" });
    }
  },
  generateElementsToTranslate,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/modalities/{id}:
 *   patch:
 *     description: edit access conditions
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/modalities/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  modalitiesDto(),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchModalities(req);
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_MODALITIES_FAIL");
      return res.status(400).json({ message: "PATCH_MODALITIES_FAIL" });
    }
  },
  generateElementsToTranslate,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/services/{id}:
 *   patch:
 *     description: edit services
 *     tags: [FormPlace]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 */
router.patch(
  "/services/:lieu_id",
  (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    req.body.services_all = req.body.services_all?.map((service: any) =>
      updateServicesWithLegacyCategories(service)
    );

    next();
  },
  getPlaceFromUrl,
  canEditPlace,
  servicesDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await patchServices(req);
      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (e) {
      req.log.error(e, "PATCH_SERVICES_FAIL");
      return res.status(500).json({ message: "PATCH_SERVICES_FAIL" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  rebuildTempServiceClosure,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/no-change/{id}:
 *   patch:
 *     description: edit a no change
 *     tags: [ManagePlace]
 *     parameters:
 *       - name: lieu_id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 *       500:
 *         description: PATCH_NO_CHANGE_IMPOSSIBLE
 *
 */
router.patch(
  "/no-change/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { updatedPlace, placeChanges } = await setNoChangeForPlace(
        req.lieu,
        req.userForLogs as UserForLogs
      );
      req.updatedPlace = updatedPlace;
      req.placeChanges = placeChanges;
      res.status(200).json(updatedPlace);
      return next();
    } catch (e) {
      req.log.error(e, "PATCH_NO_CHANGE_IMPOSSIBLE");
      return res.status(500).json({ error: "PATCH_NO_CHANGE_IMPOSSIBLE" });
    }
  },
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/duplicate/{lieu_id}:
 *   post:
 *     description: duplicate a place
 *     tags: [FormPlace]
 *     parameters:
 *       - name: placeLieuId
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 *       400:
 *         description: BAD_REQUEST
 *       500:
 *         description: DUPLICATE_PLACE_IMPOSSIBLE
 */
router.post(
  "/duplicate/:lieu_id",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  canAddPlace,
  getPlaceFromUrl,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { placeChanges, updatedPlace } = await duplicatePlace(
        req.lieu,
        req.userForLogs as UserForLogs
      );

      req.updatedPlace = updatedPlace;
      req.airtableEntity = updatedPlace;
      req.placeChanges = placeChanges;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json(updatedPlace);
      next();
    } catch (e) {
      req.log.error(e);
      return res.status(500).json({ message: "DUPLICATE_PLACE_IMPOSSIBLE" });
    }
  },
  generateElementsToTranslate,
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin/places/{id}:
 *   delete:
 *     description: delete a place
 *     tags: [ManagePlace]
 *     parameters:
 *       - name: placeMongoId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: PLACE_DELETED
 *       403:
 *         description: FORBIDDEN
 *       500:
 *         description: PLACE_DELETE_IMPOSSIBLE
 *
 */
router.delete(
  "/:lieu_id",
  getPlaceFromUrl,
  canDeletePlace,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      await deletePlace(req.lieu, req.log);
      req.placeDeleted = req.lieu;
      req.airtableId = req.lieu.atSync.airtableId;
      req.airtableEntityType = AirtableEntityType.PLACE;

      res.status(200).json({ message: "PLACE_DELETED" });
      next();
    } catch (e) {
      req.log.error(e, "PLACE_DELETE_IMPOSSIBLE");
      return res.status(500).json({ message: "PLACE_DELETE_IMPOSSIBLE" });
    }
  },
  setObsoletePlaceChanges,
  rebuildTempServiceClosure,
  syncEntityDeletion,
  () => {
    return;
  }
);

/**
 * @swagger
 *
 * /admin-place/parcours/{lieu_id}:
 *   patch:
 *     description: edit itinerary
 *     tags: [FormMaraude, parcours-maraude, modification-parcours]
 *     parameters:
 *       - name: lieu_id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 *       422:
 *         description: Invalid data
 */
router.patch(
  "/parcours/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  parcoursDto,
  getFilteredData,
  async (
    req: ExpressRequest & {
      lieu: Required<ApiPlace>;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      const { placeChanges, updatedPlace } = await patchParcours(req);
      req.airtableEntity = updatedPlace;
      req.airtableEntityType = AirtableEntityType.PLACE;
      req.placeChanges = placeChanges;
      req.updatedPlace = updatedPlace;

      res.status(200).json({ ...updatedPlace, historicEntry: !!placeChanges });
      next();
    } catch (err) {
      req.log.error(err);
      return res.status(500).json({ message: "UPDATE_PARCOURS_MARAUDE_ERROR" });
    }
  },
  setEntityExcludedOrNotAndNext,
  sendPlaceChangesToMq
);

/**
 * @swagger
 *
 * /admin-place/campaign-source/{lieu_id}:
 *   patch:
 *     description: edit an update campaign source
 *     parameters:
 *       - name: lieu_id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Place
 *       403:
 *         description: FORBIDDEN
 *       422:
 *         description: Invalid data
 */
router.patch(
  "/campaign-source/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  campaignSourceDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { placeChanges, updatedPlace } = await patchCampaignSource(req);
      req.placeChanges = placeChanges;
      req.updatedPlace = updatedPlace;

      return res.status(200).json(updatedPlace);
    } catch (e) {
      req.log.error(e, "PATCH_CAMPAIGN_SOURCE_ERROR");
    }
    return res.status(500).json({ message: "PATCH_CAMPAIGN_SOURCE_ERROR" });
  },
  sendPlaceChangesToMq
);

router.put(
  "/sources/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  sourceDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { placeChanges, updatedPlace } = await putSource(
        req.bodyValidated.source,
        req.bodyValidated.forceChanges,
        req.lieu,
        req.userForLogs as UserForLogs
      );
      req.placeChanges = placeChanges;
      req.updatedPlace = updatedPlace;

      return res
        .status(200)
        .json({ ...updatedPlace, historicEntry: !!placeChanges });
    } catch (e) {
      req.log.error(e, "PUT_SOURCE_ERROR");
    }
    return res.status(500).json({ message: "PUT_SOURCE_ERROR" });
  },
  sendPlaceChangesToMq
);

router.delete(
  "/sources/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  sourceDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { placeChanges, updatedPlace } = await deleteSource(
        req.bodyValidated.source,
        req.bodyValidated.forceChanges,
        req.lieu,
        req.userForLogs as UserForLogs
      );
      req.placeChanges = placeChanges;
      req.updatedPlace = updatedPlace;

      return res
        .status(200)
        .json({ ...updatedPlace, historicEntry: !!placeChanges });
    } catch (e) {
      req.log.error(e, "DELETE_SOURCE_ERROR");
    }
    return res.status(500).json({ message: "DELETE_SOURCE_ERROR" });
  },
  sendPlaceChangesToMq
);

router.patch(
  "/update-date/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  dateDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const updatedPlace = await patchUpdateDate(
        req.bodyValidated.date,
        req.lieu
      );

      return res.status(200).json({ ...updatedPlace, historicEntry: false });
    } catch (e) {
      req.log.error(e, "PATCH_UPDATE_DATE_ERROR");
    }
    return res.status(500).json({ message: "PATCH_UPDATE_DATE_ERROR" });
  }
);

export default router;
