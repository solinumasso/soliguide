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
import express from "express";

import { userRightsDto } from "../dto/userRights.dto";

import { ExpressRequest, ExpressResponse } from "../../_models";
import {
  canEditOrga,
  canGetOrga,
  getFilteredData,
  getOrgaFromUrl,
  getUserFromUrl,
  getPlaceFromUrl,
  canEditUser,
} from "../../middleware";
import {
  canEditPlace,
  getUserRightsForOrganization,
  patchUserRights,
} from "../controllers/user-rights.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /place/can-edit/{id}:
 *   get:
 *     description: check if a User can edit a Place
 *     tags: [Place]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: boolean
 *       404 :
 *         description: GET_RIGHTS_ON_PLACE_FAIL
 */
router.get(
  "/can-edit/:lieu_id",
  getPlaceFromUrl,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await canEditPlace(req.user, req.lieu);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_RIGHTS_ON_PLACE_FAIL");
      return res.status(500).json({ message: "GET_RIGHTS_ON_PLACE_FAIL" });
    }
  }
);

/**
 * @summary Get user rights for an organization
 */
router.get(
  "/:orgaObjectId",
  getOrgaFromUrl,
  canGetOrga,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getUserRightsForOrganization(req.organization);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_RIGHTS_FOR_ORGA_FAIL");
      return res.status(400).json({ message: "GET_RIGHTS_FOR_ORGA_FAIL" });
    }
  }
);

/**
 * @summary Update the user rights in an organization
 */
router.patch(
  "/:orgaObjectId/:userObjectId",
  getOrgaFromUrl,
  canEditOrga,
  getUserFromUrl,
  canEditUser,
  userRightsDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      if (!req.selectedUser) {
        throw new Error("No user in request");
      }
      const result = await patchUserRights(
        req.selectedUser,
        req.organization,
        req.bodyValidated
      );

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "UPDATE_RIGHTS_FAIL");
      return res.status(400).json({ message: "UPDATE_RIGHTS_FAIL" });
    }
  }
);

export default router;
