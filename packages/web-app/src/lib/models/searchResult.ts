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
import {
  PlaceStatus,
  GeoTypes,
  computePlaceOpeningStatus,
  type ApiPlace,
  CountryCodes,
  Categories,
  type Phone as CommonPhone,
  type ApiSearchResults
} from '@soliguide/common';
import { sort } from '$lib/ts';
import { computeTodayInfo, computeAddress, buildSources, computeTempInfo } from './place';
import type { SearchLocationParams, SearchResult, SearchResultItem } from './types';
import { sortServicesByRelevance } from '../utils';
import { categoryService } from '$lib/services/categoryService';

/**
 * Transformation
 */
const buildSearchResultItem = (
  place: ApiPlace,
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
      orientation: onOrientation
    },
    distance,
    id: place.lieu_id,
    name: place.name,
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
 * Transforms a itinerary steps into Places by hoisting their data
 */
const extractStepsFromItineraryPlace = (place: ApiPlace): ApiPlace[] => {
  // We have description, hours, photos and position to extract
  return place.parcours.map((step) => {
    return {
      ...place,
      hours: step.hours,
      position: step.position,
      parcours: []
    };
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
  const itineraryResultItems = itineraryResult.places.flatMap((place) => {
    const extractedSteps = extractStepsFromItineraryPlace(place);
    return extractedSteps.map((extractedStep) =>
      buildSearchResultItem(extractedStep, searchLocationParams, category)
    );
  });

  const sortedPlaces = sortPlacesByDistance([...placesResultItems, ...itineraryResultItems]);

  return {
    // NB: Impossible to calculate nbResults of itineraries, we should have the sum of nb steps of each
    nbResults: placesResult.nbResults + itineraryResult.nbResults,
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
