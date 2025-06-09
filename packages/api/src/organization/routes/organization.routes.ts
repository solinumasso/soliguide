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
const router = express.Router();

import { UserStatus } from "@soliguide/common";

import {
  ExpressRequest,
  ExpressResponse,
  OrganizationPopulate,
} from "../../_models";

import { orgaDto, searchOrgasDto } from "../dto";

import {
  getPlaceFromUrl,
  checkRights,
  getOrgaFromUrl,
  canEditOrga,
  canGetOrga,
  getUserFromUrl,
  getFilteredData,
} from "../../middleware";

import {
  addPlaceToOrga,
  removeUserFromOrga,
  removePlaceFromOrga,
} from "../controllers/manage-places-and-users.controller";

import {
  createOrganization,
  searchOrga,
  patchOrganization,
  removeOrganization,
} from "../controllers/organization.controller";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";
import { getPlaceByParams } from "../../place/services/place.service";
import { getPlacesAndUsersAndSync } from "../../middleware/events/getPlacesAndUsersAndSync.middleware";
import { getUserByParams } from "../../user/services";
import { sendUserChangesToMq } from "../../user/middlewares/send-user-changes-event-to-mq.middleware";
import { UserPopulateType } from "../../user/interfaces";

/**
 * @swagger
 *
 * /organizations/
 *   post:
 *     description: Organization by orgaObjectId
 */
router.post(
  "/",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  orgaDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    const organizationData = req.bodyValidated;

    try {
      const newOrga = await createOrganization(organizationData);
      res.status(200).json(newOrga);
    } catch (e) {
      req.log.error(e, "CREATE_ORGA_NOT_POSSIBLE");
      return res.status(400).json({ message: "CREATE_ORGA_NOT_POSSIBLE" });
    }
  }
);

router.get(
  "/addPlace/:orgaObjectId/:lieu_id",
  getOrgaFromUrl,
  getPlaceFromUrl,
  canEditOrga,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const updatedOrga = await addPlaceToOrga(req.lieu, req.organization);

      res.status(200).json(updatedOrga);

      next();
    } catch (e) {
      req.log.error(e, "ADD_PLACE_TO_ORGA_NOT_POSSIBLE");
      return res
        .status(400)
        .json({ message: "ADD_PLACE_TO_ORGA_NOT_POSSIBLE" });
    }
  },
  async (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    const place = await getPlaceByParams({ _id: req.lieu._id });

    if (place) {
      req.updatedPlace = place;
    }

    return next();
  },
  sendPlaceChangesToMq
);

router.post(
  "/search",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchOrgasDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const results = await searchOrga(req.bodyValidated, req.user);
      res.status(200).json(results);
    } catch (e) {
      req.log.error(e, "SEARCH_ORGAS_ERROR");
      return res.status(500).json({ message: "SEARCH_ORGAS_ERROR" });
    }
  }
);

/**
 * @swagger
 *
 * /organizations/:orgaObjectId
 *   get:
 *     description: Organization by orgaObjectId
 *     tags: [AdminOrganizations]
 *     parameters:
 *       - name: organization_id
 *         in: path
 *         required: true
 *         type: string
 */
router.get(
  "/:orgaObjectId",
  getOrgaFromUrl,
  canGetOrga,
  (req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json(req.organization);
  }
);

router.patch(
  "/:orgaObjectId",
  getOrgaFromUrl,
  canEditOrga,
  orgaDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const result: OrganizationPopulate = await patchOrganization(
        req.organization,
        req.bodyValidated
      );

      req.updatedPlaces = result.places;
      req.updatedUsers = result.users;

      res.status(200).json(result);

      next();
    } catch (e) {
      req.log.error(e, "UPDATE_ORGA_ERROR");
      return res.status(400).json({ message: "UPDATE_ORGA_ERROR" });
    }
  },
  getPlacesAndUsersAndSync
);

// Delete a user from an organization
router.delete(
  "/:orgaObjectId/user/:userObjectId",
  getOrgaFromUrl,
  canEditOrga,
  getUserFromUrl,
  async (
    req: ExpressRequest & {
      selectedUser: Required<UserPopulateType>;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      const updatedOrga = await removeUserFromOrga(
        req.selectedUser,
        req.organization
      );

      res.status(200).json(updatedOrga);

      next();
    } catch (e) {
      req.log.error(e, "DELETE_USER_FROM_FAIL");
      return res.status(400).json({ message: "DELETE_USER_FROM_FAIL" });
    }
  },
  async (
    req: ExpressRequest & {
      selectedUser: Required<UserPopulateType>;
    },
    _res: ExpressResponse,
    next: NextFunction
  ) => {
    const user = await getUserByParams({ _id: req.selectedUser._id });

    if (user) {
      req.updatedUser = user;
    }

    return next();
  },
  sendUserChangesToMq
);

router.delete(
  "/removePlace/:orgaObjectId/:lieu_id",
  getOrgaFromUrl,
  canEditOrga,
  getPlaceFromUrl,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const updatedOrga = await removePlaceFromOrga(req.organization, req.lieu);

      res.status(200).json(updatedOrga);

      next();
    } catch (e) {
      req.log.error(e, "DELETE_PLACE_FROM_ORGA");
      return res.status(400).json({ message: "DELETE_PLACE_FROM_ORGA" });
    }
  },
  async (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    const place = await getPlaceByParams({ _id: req.lieu._id });

    if (place) {
      req.updatedPlace = place;
    }

    return next();
  },
  sendPlaceChangesToMq
);

router.delete(
  "/:orgaObjectId",
  getOrgaFromUrl,
  canEditOrga,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const organization = req.organization as OrganizationPopulate;
      await removeOrganization(organization);

      req.updatedPlaces = organization.places;
      req.updatedUsers = organization.users;

      res.status(200).json({ message: "ORGA_DELETED_SUCCESS" });

      next();
    } catch (e) {
      req.log.error(e, "DELETE_ORGA_FAIL");
      return res.status(400).json({ message: "DELETE_ORGA_FAIL" });
    }
  },
  getPlacesAndUsersAndSync
);

export default router;
