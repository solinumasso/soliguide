import {
  ApiPlace,
  ApiSearchResults,
  UserStatus,
  CategoriesService,
} from "@soliguide/common";

import { generateSearchQuery, generateSearchOptions } from "../utils";

import { UserPopulateType } from "../../_models";

import {
  adminSearchPlacesWithParams,
  apiSearchPlacesWithParams,
  countPlacesWithLocationParams,
  searchPlacesWithParams,
} from "../services";

export const searchPlaces = async (
  categoryService: CategoriesService,
  user: UserPopulateType,
  searchPlacesData: any,
  context = "PLACE_PUBLIC_SEARCH"
): Promise<ApiSearchResults> => {
  const result: ApiSearchResults = {
    nbResults: 0,
    places: [],
  };

  const admin = [
    "EXPORT_PLACE",
    "MANAGE_PLACE",
    "ADD_PLACE_TO_ORGA",
    "MANAGE_PARCOURS",
  ].includes(context);

  const searchPlacesQuery = generateSearchQuery(
    categoryService,
    searchPlacesData,
    user,
    admin
  );

  result.nbResults = await countPlacesWithLocationParams(
    searchPlacesQuery,
    user
  );

  searchPlacesData.options = generateSearchOptions(
    result.nbResults,
    searchPlacesData.options,
    context
  );

  if (user.status === UserStatus.API_USER) {
    result.places = await apiSearchPlacesWithParams(
      searchPlacesQuery,
      user,
      searchPlacesData.options
    );
  } else {
    const serviceToCall = admin
      ? adminSearchPlacesWithParams
      : searchPlacesWithParams;

    result.places = (await serviceToCall(
      searchPlacesQuery,
      searchPlacesData.options
    )) as ApiPlace[];
  }

  return result;
};
