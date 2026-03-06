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
