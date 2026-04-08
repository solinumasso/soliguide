export type V20260303LegacyPlaceSnapshot = Readonly<Record<string, unknown>>;

export interface SearchV20260303LegacyPlaceSnapshotReader {
  readByCanonicalIds(
    ids: readonly string[],
  ): Promise<ReadonlyMap<string, V20260303LegacyPlaceSnapshot>>;
}

export const SEARCH_V20260303_LEGACY_PLACE_SNAPSHOT_READER = Symbol(
  'SEARCH_V20260303_LEGACY_PLACE_SNAPSHOT_READER',
);
