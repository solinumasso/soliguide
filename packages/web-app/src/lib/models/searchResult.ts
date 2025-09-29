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

const computeDistance = (
  place: ApiPlace | ApiPlaceWithCrossingPointIndex,
  locationParams: SearchLocationParams
): number => {
  if (typeof place.distance === 'number') {
    return place.distance;
  }

  const [searchLat, searchLong] = locationParams.coordinates;
  const [placeLat, placeLong] = place.position.location.coordinates;

  const distance =
    searchLat === placeLat && searchLong === placeLong
      ? 0
      : calculateDistanceBetweenTwoPoints(searchLat, searchLong, placeLat, placeLong);

  return distance;
};

/**
 * Transformation
 */
const buildSearchResultItem = (
  place: ApiPlace | ApiPlaceWithCrossingPointIndex,
  locationParams: SearchLocationParams,
  categorySearched: Categories
): SearchResultItem => {
  const onOrientation = Boolean(place.modalities.orientation.checked);

  const distance = computeDistance(place, locationParams);

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
      distance,
      position: place.position
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
    searchGeoType: locationParams.geoType,
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
 * Transforms itinerary crossing points into Places by hoisting their data
 * Calculate their distance from the search location
 * Also filter crossing points that are out of the search radius
 */
const extractCrossingPointsFromItineraryPlace = (
  place: ApiPlace,
  locationParams: SearchLocationParams
): ApiPlaceWithCrossingPointIndex[] => {
  const [searchLat, searchLong] = locationParams.coordinates;

  return place.parcours.flatMap((crossingPoint, index) => {
    // Handle case where coordinates are identical to avoid NaN from calculateDistanceBetweenTwoPoints
    const [crossingPointLat, crossingPointLon] = crossingPoint.position.location.coordinates;
    const distance =
      searchLat === crossingPointLat && searchLong === crossingPointLon
        ? 0
        : calculateDistanceBetweenTwoPoints(
            searchLat,
            searchLong,
            crossingPointLat,
            crossingPointLon
          );

    if (distance > locationParams.distance) return [];

    return [
      {
        ...place,
        distance: distance * 1000, // in meters
        newhours: crossingPoint.hours,
        position: crossingPoint.position,
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

  // We extract itinerary crossing points and build a "place" for each one of them
  const itineraryResultItems = itineraryResult.places.flatMap((place) => {
    const extractedCrossingPoints = extractCrossingPointsFromItineraryPlace(
      place,
      searchLocationParams
    );
    return extractedCrossingPoints.map((extractedCrossingPoint) =>
      buildSearchResultItem(extractedCrossingPoint, searchLocationParams, category)
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
