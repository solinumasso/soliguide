import type { SupportedLanguagesCode } from '@soliguide/common';
import type { FavoriteItem } from '$lib/models/favorite';
import type { SearchResultPlaceCard } from '$lib/models/types';
import type { Writable } from 'svelte/store';
import type { PosthogCaptureFunction } from '$lib/services/types';

export interface PageState {
  loading: boolean;
  favoritePlaces: SearchResultPlaceCard[];
  error: string | null;
  lang: SupportedLanguagesCode;
}

export interface CachedFavoritesData {
  favorites: FavoriteItem[];
  places: SearchResultPlaceCard[];
  lang: string;
  timestamp: number;
}

export interface FavoritesPageController {
  loadFavoritePlaces: (favorites: FavoriteItem[], lang?: SupportedLanguagesCode) => Promise<void>;
  syncWithFavorites: (favorites: FavoriteItem[]) => void;
  subscribe: Writable<PageState>['subscribe'];
  captureEvent: PosthogCaptureFunction;
}
