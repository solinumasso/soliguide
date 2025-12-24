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
import express, { type NextFunction } from "express";
import {
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  UserStatus,
} from "@soliguide/common";

import {
  getPlaceFromUrl,
  canGetPlace,
  logPlace,
  handleLanguage,
} from "../../middleware";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import { getTranslatedPlace } from "../../translations/controllers/translation.controller";
import { cleanPlaceCategorySpecificFields } from "../utils";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Place
 */

/**
 * @swagger
 *
 * /place/{id}:
 *   get:
 *     description: get Place by lieu_id
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
 *         description: place
 *       404 :
 *         description: PLACE_NOT_FOUND
 */

const guards = [getPlaceFromUrl, canGetPlace];

router.get(
  "/:lieu_id/:lang?",
  guards,
  handleLanguage,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const { lieu } = req;

    const userLanguage = req.requestInformation.language;

    if (
      userLanguage &&
      SUPPORTED_LANGUAGES_BY_COUNTRY[req.lieu.country as SoliguideCountries]
        .source !== userLanguage
    ) {
      req.lieu = await getTranslatedPlace(lieu, userLanguage);
    }

    if (req.user.status === UserStatus.API_USER) {
      // Remove non shareable specific fields
      req.lieu = cleanPlaceCategorySpecificFields(req.lieu);

      // Remove the place address if on orientation
      if (req.lieu.modalities.orientation.checked) {
        req.lieu.address = null;
        req.lieu.complementAddress = null;
      }
    }

    res.status(200).json(req.lieu);
    next();
  },
  logPlace
);

export default router;
