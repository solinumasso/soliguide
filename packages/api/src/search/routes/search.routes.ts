import { Router, type NextFunction } from "express";

import {
  CountryCodes,
  PlaceType,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
  UserStatus,
} from "@soliguide/common";

import { searchPlaces } from "../controllers/search.controller";

import { searchAdminDto, searchAdminForOrgasDto, searchDto } from "../dto";

import type { ExpressRequest, ExpressResponse } from "../../_models";

import {
  checkRights,
  getFilteredData,
  logSearchQuery,
  handleLanguage,
  overrideLocationWithAreasInfo,
  mobilityConverting,
  locationApiCountryHandling,
} from "../../middleware";

import { getTranslatedPlacesForSearch } from "../../translations/controllers/translation.controller";
import { trackSearchPlaces } from "../../middleware/analytics";
import { convertPlaceFromNewMobilityToOld } from "../utils";

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
