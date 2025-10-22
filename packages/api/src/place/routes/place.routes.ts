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
  CountryCodes,
  FAVORITES_LIMIT,
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
  UserStatus,
  type ApiSearchResults,
} from "@soliguide/common";

import {
  getPlaceFromUrl,
  canGetPlace,
  logPlace,
  handleLanguage,
  getFilteredData,
} from "../../middleware";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import { 
  getTranslatedPlace,
  getTranslatedPlacesForSearch 
} from "../../translations/controllers/translation.controller";
import { cleanPlaceCategorySpecificFields } from "../utils";
import { getPlacesByIds } from "../services/place.service";
import { lookupDto } from "../../search/dto";

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

/**
 * @swagger
 *
 * /place/lookup/{lang}:
 *   post:
 *     description: Lookup places by IDs
 *     tags: [Place]
 *     parameters:
 *       - name: ids
 *         required: true
 *         in: formData
 *         type: array
 *         items:
 *           type: number
 *       - name: lang
 *         in: path
 *         required: false
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: places lookup results
 *       500:
 *         description: LOOKUP_ERROR
 */
router.post(
  "/lookup/:lang?",
  handleLanguage,
  lookupDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const { ids } = req.bodyValidated;
      const uniqueIds = Array.from(new Set<number>(ids));
      const limitedIds = uniqueIds.slice(0, FAVORITES_LIMIT);
      
      const places = await getPlacesByIds(limitedIds);
      const placeById = new Map(places.map((place) => [place.lieu_id, place]));
      const orderedPlaces = limitedIds
        .map((id) => placeById.get(id))
        .filter((place): place is typeof places[number] => place !== undefined);

      const lookupResults: ApiSearchResults = {
        nbResults: orderedPlaces.length,
        places: orderedPlaces,
      };

      const country = req.bodyValidated?.country ?? CountryCodes.FR;

      if (
        req?.params?.lang &&
        SUPPORTED_LANGUAGES_BY_COUNTRY[country as unknown as SoliguideCountries]
          .source !== req?.params?.lang
      ) {
        lookupResults.places = await getTranslatedPlacesForSearch(
          lookupResults.places,
          req?.params?.lang as SupportedLanguagesCode
        );
      }

      req.nbResults = lookupResults.nbResults;
      res.status(200).json(lookupResults);
    } catch (e) {
      req.log.error(e, "LOOKUP_ERROR");
      res.status(500).json({ message: "LOOKUP_ERROR" });
    }
  }
);

export default router;
