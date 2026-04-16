import {
  Categories,
  CountryCodes,
  GeoTypes,
  PlaceType,
} from "@soliguide/common";

import { CompatibilityCase } from "./compatibility.types";

const POSITION_SEARCH_PAYLOAD = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: "75003",
      departement: "Paris",
      region: "Ile-de-France",
      ville: "Paris",
      country: CountryCodes.FR,
    },
    coordinates: [2.3525855, 48.8636338],
    distance: 5,
    geoType: GeoTypes.POSITION,
    geoValue: "203-rue-saint-martin-75003-paris",
    label: "203 Rue Saint-Martin, 75003 Paris",
  },
  options: { limit: 20, page: 1 },
  placeType: PlaceType.PLACE,
  status: null,
  word: null,
} satisfies Record<string, unknown>;

const CITY_SEARCH_PAYLOAD = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: null,
      departement: "Paris",
      region: "Ile-de-France",
      ville: "Paris",
      country: CountryCodes.FR,
    },
    coordinates: [2.3522219, 48.856614],
    distance: 5,
    geoType: GeoTypes.CITY,
    geoValue: "paris",
    label: "Paris",
  },
  options: { limit: 20, page: 1 },
  placeType: PlaceType.PLACE,
  status: null,
  word: null,
} satisfies Record<string, unknown>;

const OPEN_TODAY_SEARCH_PAYLOAD = {
  ...POSITION_SEARCH_PAYLOAD,
  openToday: true,
} satisfies Record<string, unknown>;

const ITINERARY_CITY_SEARCH_PAYLOAD = {
  ...CITY_SEARCH_PAYLOAD,
  placeType: PlaceType.ITINERARY,
} satisfies Record<string, unknown>;

const MULTI_CATEGORIES_SEARCH_PAYLOAD = {
  ...CITY_SEARCH_PAYLOAD,
  categories: [Categories.FOOD_DISTRIBUTION, Categories.FOOD_PACKAGES],
} satisfies Record<string, unknown>;

const COMMENTED_OUT_CASE_PAYLOADS = [
  OPEN_TODAY_SEARCH_PAYLOAD,
  ITINERARY_CITY_SEARCH_PAYLOAD,
  MULTI_CATEGORIES_SEARCH_PAYLOAD,
] as const;
void COMMENTED_OUT_CASE_PAYLOADS;

export const SEARCH_COMPATIBILITY_CASES: CompatibilityCase<
  Record<string, unknown>
>[] = [
  {
    id: "search-position",
    title: "search by GPS position",
    routeIntent: "search",
    payload: POSITION_SEARCH_PAYLOAD,
  },
  {
    id: "search-city",
    title: "search by city",
    routeIntent: "search",
    payload: CITY_SEARCH_PAYLOAD,
  },
  {
    id: "search-open-today",
    title: "search with openToday filter",
    routeIntent: "search",
    payload: OPEN_TODAY_SEARCH_PAYLOAD,
  },
  {
    id: "search-itinerary",
    title: "search itineraries by city",
    routeIntent: "search",
    payload: ITINERARY_CITY_SEARCH_PAYLOAD,
  },
  {
    id: "search-multi-categories",
    title: "search with multiple categories",
    routeIntent: "search",
    payload: MULTI_CATEGORIES_SEARCH_PAYLOAD,
  },
];
