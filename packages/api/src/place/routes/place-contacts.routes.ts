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

import { displayContactProDto } from "../../user/dto";

import {
  getPlaceFromUrl,
  canGetPlace,
  canEditPlace,
  getFilteredData,
  canGetContact,
} from "../../middleware";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import {
  getContactsProForPlace,
  getContactsProForPlaceAdmin,
  patchDisplayContactPro,
} from "../controllers";
import { UserRightUserPopulate } from "../../user/interfaces";

const router = express.Router();

/**
 * @summary Get a place's contacts
 */
router.get(
  "/:lieu_id",
  getPlaceFromUrl,
  canGetPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getContactsProForPlace(req.lieu);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_ROLES_FOR_FICHE_FAIL");
      return res.status(400).json({ message: "GET_ROLES_FOR_FICHE_FAIL" });
    }
  }
);

router.get(
  "/:lieu_id/admin",
  getPlaceFromUrl,
  canGetPlace,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await getContactsProForPlaceAdmin(req.lieu, req.user);

      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "GET_ROLES_FOR_FICHE_FAIL");
      return res.status(400).json({ message: "GET_ROLES_FOR_FICHE_FAIL" });
    }
  }
);

/**
 * @summary Update the contact visibility
 */
router.patch(
  "/display-contact/:userRightObjectId",
  canGetContact,
  displayContactProDto,
  getFilteredData,
  async (
    req: ExpressRequest & {
      selectedUserRight: UserRightUserPopulate;
    },
    res: ExpressResponse
  ) => {
    try {
      await patchDisplayContactPro(req.selectedUserRight, req.bodyValidated);
      return res.status(200).json({ message: "OK" });
    } catch (e) {
      req.log.error(e, "PATCH_CONTACT_FAIL");
      return res.status(400).json({ message: "PATCH_CONTACT_FAIL" });
    }
  }
);

export default router;
