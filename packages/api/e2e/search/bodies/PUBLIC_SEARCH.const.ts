import {
  Categories,
  CountryCodes,
  GeoTypes,
  PlaceType,
} from "@soliguide/common";

export const PUBLIC_SEARCH_POSITION_OK = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: "75003",
      departement: "Paris",
      region: "Île-de-France",
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
};

export const PUBLIC_SEARCH_CITY_OK = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: null,
      departement: "Paris",
      region: "Île-de-France",
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
};

export const PUBLIC_SEARCH_OPEN_TODAY_OK = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: "75003",
      departement: "Paris",
      region: "Île-de-France",
      ville: "Paris",
      country: CountryCodes.FR,
    },
    coordinates: [2.3525855, 48.8636338],
    distance: 5,
    geoType: GeoTypes.POSITION,
    geoValue: "203-rue-saint-martin-75003-paris",
    label: "203 Rue Saint-Martin, 75003 Paris",
  },
  openToday: true,
  options: { limit: 20, page: 1 },
  placeType: PlaceType.PLACE,
  status: null,
  word: null,
};

export const PUBLIC_SEARCH_MULTIPLE_CATEGORIES_OK = {
  campaignStatus: null,
  categories: [Categories.FOOD_DISTRIBUTION, Categories.FOOD_PACKAGES],
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: null,
      departement: "Paris",
      region: "Île-de-France",
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
};

export const ITINERARY_PUBLIC_SEARCH_CITY_OK = {
  campaignStatus: null,
  category: null,
  close: null,
  label: null,
  lieu_id: null,
  location: {
    areas: {
      codePostal: null,
      departement: "Paris",
      region: "Île-de-France",
      ville: "Paris",
      country: CountryCodes.FR,
    },
    coordinates: [2.3525855, 48.8636338],
    distance: 5,
    geoType: GeoTypes.CITY,
    geoValue: "paris",
    label: "Paris",
  },
  options: { limit: 20, page: 1 },
  placeType: PlaceType.ITINERARY,
  status: null,
  word: null,
};
