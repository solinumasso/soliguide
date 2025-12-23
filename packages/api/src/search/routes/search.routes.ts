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
  ApiPlace,
  CountryCodes,
  type GeoPosition,
  GeoTypes,
  PlaceType,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
  UserStatus,
  getCategoryFromLegacyCategory,
  convertOldToNewMobilityCategory,
  convertNewToOldMobilityCategory,
  isLegacyMobilityCategory,
  isNewMobilityCategory,
  type LegacyMobilityCategory,
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
} from "../../middleware";

import { getTranslatedPlacesForSearch } from "../../translations/controllers/translation.controller";
import SearchSuggestionsController from "../controllers/search-suggestions.controller";
import { createCache } from "cache-manager";
import { trackSearchPlaces } from "../../middleware/analytics";

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
  (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    if (req.body.categorie) {
      req.body.category = getCategoryFromLegacyCategory(req.body.categorie);
    }

    if (
      req.body.categories?.length &&
      typeof req.body.categories[0] === "number"
    ) {
      req.body.categories = req.body.categories.map((category: number) =>
        getCategoryFromLegacyCategory(category)
      );
    }

    next();
  },
  // Convert legacy mobility categories to new categories for API users
  (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    if (req.user.status !== UserStatus.API_USER) {
      return next();
    }

    // Track if we need to convert results back to legacy format
    req.shouldConvertMobilityCategories = false;

    // Convert single category
    if (req.body.category && isLegacyMobilityCategory(req.body.category)) {
      const newCategory = convertOldToNewMobilityCategory(req.body.category);
      if (newCategory) {
        req.body.category = newCategory;
        req.shouldConvertMobilityCategories = true;
      }
    }

    // Convert multiple categories
    if (req.body.categories?.length) {
      const hasLegacyCategory = req.body.categories.some(
        (categorie: string) =>
          typeof categorie === "string" && isLegacyMobilityCategory(categorie)
      );

      if (hasLegacyCategory) {
        req.body.categories = req.body.categories.map((category: string) => {
          if (
            typeof category === "string" &&
            isLegacyMobilityCategory(category)
          ) {
            const newCategory = convertOldToNewMobilityCategory(category);
            return newCategory ?? category;
          }
          return category;
        });
        req.shouldConvertMobilityCategories = true;
      }
    }

    next();
  },
  // [LOCATION API] To remove at the beginning of May
  (req: ExpressRequest, _res: ExpressResponse, next: NextFunction) => {
    if (
      req.user.isLogged() &&
      req.user.status === UserStatus.API_USER &&
      req.body.location?.geoType === GeoTypes.COUNTRY &&
      /^france$/i.test(req.body.location?.geoValue)
    ) {
      req.body.location.geoValue = CountryCodes.FR;
    }

    if (
      req.user.isLogged() &&
      req.user.status === UserStatus.API_USER &&
      req.body["location.geoType"] === GeoTypes.COUNTRY &&
      /^france$/i.test(req.body["location.geoValue"])
    ) {
      req.body["location.geoValue"] = CountryCodes.FR;
    }

    if (req.body.locations?.length) {
      req.body.locations = req.body.locations.map(
        (location: Partial<GeoPosition>) => {
          if (
            location?.geoType === GeoTypes.COUNTRY &&
            /^france$/i.test(location?.geoValue ?? "")
          ) {
            location.geoValue = CountryCodes.FR;
          }
          return location;
        }
      );
    }

    next();
  },
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
        searchResults.places = searchResults.places.map((place: ApiPlace) => {
          if (!place.services_all?.length) return place;

          return {
            ...place,
            services_all: place.services_all.map((service) => {
              if (!service.category) return service;

              // Only convert if it's a new mobility category
              if (!isNewMobilityCategory(service.category)) return service;

              const legacyCategory = convertNewToOldMobilityCategory(
                service.category
              );

              // If conversion found, return service with legacy category
              if (legacyCategory) {
                return {
                  ...service,
                  category: legacyCategory as LegacyMobilityCategory,
                };
              }

              return service;
            }),
          };
        }) as ApiPlace[];
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
