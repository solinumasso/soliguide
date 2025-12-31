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
import { Router, type NextFunction } from "express";

import {
  CountryCodes,
  PlaceType,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
  UserStatus,
} from "@soliguide/common";

import { searchTerm } from "../controllers/auto-complete.controller";
import { searchPlaces } from "../controllers/search.controller";

import {
  searchAdminDto,
  searchAdminForOrgasDto,
  autoCompleteSearchDto,
  searchDto,
  searchSuggestionDto,
} from "../dto";

import type { ExpressRequest, ExpressResponse } from "../../_models";

import {
  checkRights,
  isNotApiUser,
  getFilteredData,
  logSearchQuery,
  handleLanguage,
  overrideLocationWithAreasInfo,
  mobilityConverting,
  locationApiCountryHandling,
} from "../../middleware";

import { getTranslatedPlacesForSearch } from "../../translations/controllers/translation.controller";
import SearchSuggestionsController from "../controllers/search-suggestions.controller";
import { createCache } from "cache-manager";
import { trackSearchPlaces } from "../../middleware/analytics";
import { convertPlaceFromNewMobilityToOld } from "../utils";

const searchSuggestionsCache = createCache({ ttl: 30 * 24 * 60 * 60 });

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SearchPlace
 *   description: Search related routes
 */

/**
 * @swagger
 *
 * /new-search/admin-search:
 */
router.post(
  "/admin-search",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchAdminDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const searchData = req.bodyValidated;
    const context =
      searchData.placeType === PlaceType.PLACE
        ? "MANAGE_PLACE"
        : "MANAGE_PARCOURS";

    try {
      const searchResults = await searchPlaces(
        req.requestInformation.categoryService,
        req.user,
        searchData,
        context
      );

      req.nbResults = searchResults.nbResults;
      req.adminSearch = true;

      res.status(200).json(searchResults);
      next();
    } catch (e) {
      req.log.error(e, "ADMIN_SEARCH_ERROR");
      res.status(500).json({ message: "ADMIN_SEARCH_ERROR" });
    }
  },
  logSearchQuery,
  trackSearchPlaces
);

router.post(
  "/admin-search-to-add-place-in-orga",
  checkRights([
    UserStatus.ADMIN_SOLIGUIDE,
    UserStatus.ADMIN_TERRITORY,
    UserStatus.PRO,
  ]),
  searchAdminForOrgasDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const searchData = req.bodyValidated;

      const searchResults = await searchPlaces(
        req.requestInformation.categoryService,
        req.user,
        searchData,
        "ADD_PLACE_TO_ORGA"
      );

      req.nbResults = searchResults.nbResults;

      return res.status(200).json(searchResults);
    } catch (e) {
      req.log.error(e, "SEARCH_ORGANIZATIONS_ERROR");
      return res.status(500).json({ message: "SEARCH_ORGANIZATIONS_ERROR" });
    }
  }
);

// @deprecated
router.get(
  "/auto-complete/:term",
  isNotApiUser,
  autoCompleteSearchDto("term"),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const autocompleteResults = await searchTerm(req.bodyValidated.term);

      res.status(200).json(autocompleteResults);
    } catch (e) {
      req.log.error(e, "AUTOCOMPLETE_FAILED");
      res.status(500).json({ message: "AUTOCOMPLETE_FAILED" });
    }
  }
);

router.get(
  "/search-suggestions/:country/:term",
  isNotApiUser,
  searchSuggestionDto("term"),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    const cacheKey = `search:${req.bodyValidated.term}`;
    const results = await searchSuggestionsCache.get(cacheKey);
    if (results) {
      return res.status(200).json(results);
    }
    try {
      const autocompleteResults = SearchSuggestionsController.autoComplete(
        req.bodyValidated.term,
        req.bodyValidated.country,
        req.bodyValidated.lang
      );
      searchSuggestionsCache.set(cacheKey, autocompleteResults);

      return res.status(200).json(autocompleteResults);
    } catch (e) {
      req.log.error(e, "AUTOCOMPLETE_FAILED");
      res.status(500).json({ message: "AUTOCOMPLETE_FAILED" });
    }
  }
);

/**
 * @swagger
 *
 * /new-search/:
 *   post:
 *     description: Search places
 *     tags: [SearchPlace]
 *     parameters:
 *       - name: search
 *         required: true
 *         in: formData
 *         type: object
 */
router.post(
  "/:lang?",
  handleLanguage,
  locationApiCountryHandling,
  mobilityConverting,
  searchDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const searchData = req.bodyValidated;
      const user = req.user;
      const context =
        user.status === UserStatus.API_USER
          ? "API"
          : searchData.placeType === PlaceType.PLACE
          ? "PLACE_PUBLIC_SEARCH"
          : "ITINERARY_PUBLIC_SEARCH";

      const searchResults = await searchPlaces(
        req.requestInformation.categoryService,
        user,
        searchData,
        context
      );

      const country = req.bodyValidated?.country ?? CountryCodes.FR;

      if (
        req?.params?.lang &&
        SUPPORTED_LANGUAGES_BY_COUNTRY[country as unknown as SoliguideCountries]
          .source !== req?.params?.lang
      ) {
        searchResults.places = await getTranslatedPlacesForSearch(
          searchResults.places,
          req?.params?.lang as SupportedLanguagesCode
        );
      }

      // Convert new mobility categories back to legacy format for API users
      if (req.shouldConvertMobilityCategories && searchResults.places) {
        searchResults.places = convertPlaceFromNewMobilityToOld([
          ...searchResults.places,
        ]);
      }

      req.nbResults = searchResults.nbResults;
      res.status(200).json(searchResults);
      next();
    } catch (e) {
      req.log.error(e, "SEARCH_ERROR");
      res.status(500).json({ message: "SEARCH_ERROR" });
    }
  },
  overrideLocationWithAreasInfo,
  logSearchQuery,
  trackSearchPlaces
);

export default router;
