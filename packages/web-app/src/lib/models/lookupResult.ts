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
import { GeoTypes, type ApiPlace, type ApiSearchResults } from '@soliguide/common';
import type { FavoriteItem } from '$lib/models/favorite';
import { buildLightPlaceCard } from './searchResult';
import type { SearchFavorisResult, SearchResultPlaceCard } from './types';

const buildFavoritePlaceCard = (
  place: ApiPlace,
  favorite: FavoriteItem
): SearchResultPlaceCard | null => {
  const crossingPoint =
    typeof favorite.crossingPointIndex === 'number'
      ? place.parcours?.[favorite.crossingPointIndex]
      : null;

  if (typeof favorite.crossingPointIndex === 'number' && !crossingPoint) {
    return null;
  }

  const placeForCard = crossingPoint
    ? {
        ...place,
        position: crossingPoint.position,
        newhours: crossingPoint.hours,
        parcours: [],
        crossingPointIndex: favorite.crossingPointIndex
      }
    : place;

  const lightCard = buildLightPlaceCard(placeForCard, place.services_all);
  const position = crossingPoint?.position ?? place.position;

  return {
    ...lightCard,
    dataForLogs: {
      // eslint-disable-next-line no-underscore-dangle
      id: place?._id,
      lieuId: place.lieu_id,
      distance: 0,
      position
    },
    distance: 0,
    searchGeoType: GeoTypes.UNKNOWN
  };
};

/**
 * Builds a lookup result from a places query (for favorites)
 * Does not sort services by category relevance since there's no search context
 */
const buildLookupResult = (
  placesResult: ApiSearchResults,
  favorites: FavoriteItem[]
): SearchFavorisResult => {
  const placeById = new Map<number, ApiPlace>(
    placesResult.places.map((place) => [place.lieu_id, place])
  );

  const places = favorites.reduce<SearchResultPlaceCard[]>((acc, favorite) => {
    const place = placeById.get(favorite.lieuId);
    if (!place) return acc;

    const favoriteCard = buildFavoritePlaceCard(place, favorite);
    return favoriteCard ? [...acc, favoriteCard] : acc;
  }, []);

  return {
    nbResults: places.length,
    places
  };
};

export { buildLookupResult };
