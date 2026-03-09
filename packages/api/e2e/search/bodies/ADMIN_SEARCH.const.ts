import {
  type AnyDepartmentCode,
  Categories,
  CountryCodes,
  DEPARTMENT_CODES,
  GeoPosition,
  GeoTypes,
  ManageSearchOptions,
  type PlaceSearchForAdmin,
  PlaceType,
  type SoliguideCountries,
  SortingOrder,
} from "@soliguide/common";

export const ADMIN_SEARCH_PLACE_AND_CATEGORY_OK: Partial<PlaceSearchForAdmin> & {
  options: ManageSearchOptions;
  country: SoliguideCountries;
  territories: AnyDepartmentCode[];
} = {
  campaignStatus: null,
  catToExclude: [],
  category: Categories.EMERGENCY_ACCOMMODATION,
  close: null,
  label: null,
  lieu_id: null,
  location: new GeoPosition({
    coordinates: [],
    distance: 5,
    geoType: GeoTypes.UNKNOWN,
    geoValue: "",
  }),
  options: {
    limit: 50,
    page: 1,
    sortBy: "lieu_id",
    sortValue: SortingOrder.ASCENDING,
  },
  placeType: PlaceType.PLACE,
  country: CountryCodes.FR,
  territories: DEPARTMENT_CODES[CountryCodes.FR],
  status: null,
  visibility: null,
  word: null,
  updatedAt: null,
};

export const ADMIN_SEARCH_ITINERARY_AND_POSITION_OK: Partial<PlaceSearchForAdmin> & {
  options: ManageSearchOptions;
  country: SoliguideCountries;
  territories: AnyDepartmentCode[];
} = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: new GeoPosition({
    coordinates: [],
    distance: 5,
    geoType: GeoTypes.UNKNOWN,
    geoValue: "",
  }),
  options: {
    limit: 50,
    page: 1,
    sortBy: "lieu_id",
    sortValue: SortingOrder.ASCENDING,
  },
  placeType: PlaceType.ITINERARY,
  country: CountryCodes.FR,
  territories: DEPARTMENT_CODES[CountryCodes.FR],
  status: null,
  visibility: null,
  word: null,
};
