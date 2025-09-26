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
import { categoryService } from '$lib/services/categoryService';
import { sort } from '$lib/ts';
import {
  type ApiPlace,
  type ApiSearchResults,
  Categories,
  type Phone as CommonPhone,
  CountryCodes,
  GeoTypes,
  PlaceStatus,
  calculateDistanceBetweenTwoPoints,
  computePlaceOpeningStatus
} from '@soliguide/common';
import { sortServicesByRelevance } from '../utils';
import {
  buildSources,
  computeAddress,
  computeCampaignBanner,
  computeTempInfo,
  computeTodayInfo
} from './place';
import type {
  ApiPlaceWithCrossingPointIndex,
  SearchLocationParams,
  SearchResult,
  SearchResultItem
} from './types';

/**
 * Transformation
 */
const buildSearchResultItem = (
  place: ApiPlace | ApiPlaceWithCrossingPointIndex,
  locationParams: SearchLocationParams,
  categorySearched: Categories
): SearchResultItem => {
  const onOrientation = Boolean(place.modalities.orientation.checked);

  const distance =
    locationParams.geoType === GeoTypes.POSITION &&
    place.status !== PlaceStatus.PERMANENTLY_CLOSED &&
    place.status !== PlaceStatus.DRAFT &&
    typeof place.distance === 'number' &&
    !onOrientation
      ? place.distance
      : -1;

  const status = computePlaceOpeningStatus(place);

  const allCategoriesByTheme = categoryService.getAllCategories();

  const sortedServices = sortServicesByRelevance(
    place.services_all,
    categorySearched,
    allCategoriesByTheme
  );

  return {
    address: computeAddress(place.position, onOrientation),
    banners: {
      holidays: place.newhours.closedHolidays,
      orientation: onOrientation,
      campaign: computeCampaignBanner(place)
    },
    dataForLogs: {
      // eslint-disable-next-line no-underscore-dangle
      id: place?._id,
      lieuId: place.lieu_id,
      position: {
        country: place?.country,
        department: place.position.department,
        departmentCode: place.position?.departmentCode,
        distance,
        region: place.position.region,
        regionCode: place.position?.regionCode
      }
    },
    distance,
    id: place.lieu_id,
    name: place.name,
    ...('crossingPointIndex' in place ? { crossingPointIndex: place.crossingPointIndex } : {}),
    phones: [
      ...place.entity.phones.map((phone: CommonPhone) => ({
        ...phone,
        countryCode: phone.countryCode as CountryCodes
      }))
    ],
    seoUrl: place.seo_url,
    services: sortedServices
      .map((service) => service?.category)
      .filter((category) => typeof category !== 'undefined'),
    sources: buildSources(place.sources),
    status,
    todayInfo: computeTodayInfo(place, status),
    tempInfo: computeTempInfo(place.tempInfos)
  };
};

/**
 * Transforms itinerary steps into Places by hoisting their data
 * Calculate their distance from the search location
 * Also filter steps that are out of the search radius
 */
const extractStepsFromItineraryPlace = (
  place: ApiPlace,
  locationParams: SearchLocationParams
): ApiPlaceWithCrossingPointIndex[] => {
  const [lat, lon] = locationParams.coordinates;

  return place.parcours.flatMap((step, index) => {
    // Handle case where coordinates are identical to avoid NaN from calculateDistanceBetweenTwoPoints
    const [stepLat, stepLon] = step.position.location.coordinates;
    const distance =
      lat === stepLat && lon === stepLon
        ? 0
        : calculateDistanceBetweenTwoPoints(lat, lon, stepLat, stepLon);

    if (distance > locationParams.distance) return [];

    return [
      {
        ...place,
        distance: distance * 1000, // in meters
        newhours: step.hours,
        position: step.position,
        parcours: [],
        crossingPointIndex: index
      }
    ];
  });
};

/**
 * Sort by distance ascending.
 * If an item is out of range, it is removed
 */
const sortPlacesByDistance = (places: SearchResultItem[]): SearchResultItem[] => {
  return sort(
    places,
    (place1: SearchResultItem, place2: SearchResultItem) => place1.distance - place2.distance
  );
};

/**
 * Merges result from two queries : places and itineraries.
 * Itinerary items contain steps, each one of them will become a SearchResultItem
 */
const buildSearchResultWithParcours = (
  placesResult: ApiSearchResults,
  itineraryResult: ApiSearchResults,
  searchLocationParams: SearchLocationParams,
  category: Categories
): SearchResult => {
  const placesResultItems = placesResult.places.map((place) =>
    buildSearchResultItem(place, searchLocationParams, category)
  );

  // We extract itinerary steps and build a "place" for each one of them
  const itineraryResultItems = itineraryResult.places.flatMap((place) => {
    const extractedSteps = extractStepsFromItineraryPlace(place, searchLocationParams);
    return extractedSteps.map((extractedStep) =>
      buildSearchResultItem(extractedStep, searchLocationParams, category)
    );
  });
  const sortedPlaces = sortPlacesByDistance([...placesResultItems, ...itineraryResultItems]);

  return {
    nbResults: placesResult.nbResults + itineraryResultItems.length,
    places: sortedPlaces
  };
};

/**
 * Builds a search result from a places query
 */
const buildSearchResult = (
  placesResult: ApiSearchResults,
  searchLocationParams: SearchLocationParams,
  category: Categories
): SearchResult => {
  const placesResultItems = placesResult.places.map((place) =>
    buildSearchResultItem(place, searchLocationParams, category)
  );

  return {
    nbResults: placesResult.nbResults,
    places: placesResultItems
  };
};

export { buildSearchResult, buildSearchResultWithParcours };
