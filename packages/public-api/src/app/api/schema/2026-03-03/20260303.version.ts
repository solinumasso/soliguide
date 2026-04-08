import { Inject, Injectable } from '@nestjs/common';
import type {
  ResponseDowngradeContext,
  Version,
} from '../../../../api-versioning/versioning';
import { PlacesDatabaseService } from '../../../search/adapters/mongo/places-database.service';
import { MongoSearchV20260303LegacyPlaceSnapshotReader } from './2026-03-03.mongo-legacy-place-snapshot-reader.adapter';
import {
  SEARCH_V20260303_LEGACY_PLACE_SNAPSHOT_READER,
  type SearchV20260303LegacyPlaceSnapshotReader,
  type V20260303LegacyPlaceSnapshot,
} from './2026-03-03.legacy-place-snapshot-reader.port';
import {
  IsoFormatOnUpdatedAt,
  RemoveLegacyAutoFlag,
  RemoveLegacyCloseField,
  RemoveLegacyCreatedAtField,
  RemoveLegacyDistanceField,
  RemoveLegacyGeoZonesField,
  RemoveLegacyPhotosField,
  RemoveLegacySlugsField,
  RemoveLegacySourcesField,
  RemoveLegacyStatusField,
  RemoveLegacyUpdatedByUserAtField,
  RemoveLegacyVisibilityField,
  RemoveMongoObjectId,
  RenameSeoUrl,
  RenameUniqueIdentifier,
  ReplaceEntityByContacts,
  ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches,
  ReplaceModalitiesByAccess,
  ReplacePublicsByAudience,
  ReplaceServicesAllByServices,
  ReplaceTempInfosByTemporaryInformation,
} from './search.response/2026-03-03.search.response';

interface V20260303ResponseDowngradeContextEntry {
  legacyById: ReadonlyMap<string, V20260303LegacyPlaceSnapshot>;
}

interface V20260303ResponseDowngradeContextContainer {
  v20260303?: V20260303ResponseDowngradeContextEntry;
}

type LegacyFieldReader = (
  container: Record<string, unknown>,
  field: string,
  context?: ResponseDowngradeContext,
) => unknown;

@Injectable()
export class SearchVersion20260303Provider {
  constructor(
    @Inject(SEARCH_V20260303_LEGACY_PLACE_SNAPSHOT_READER)
    private readonly legacySnapshotReader: SearchV20260303LegacyPlaceSnapshotReader = new MongoSearchV20260303LegacyPlaceSnapshotReader(
      new PlacesDatabaseService(),
    ),
  ) {}

  toVersion(): Version {
    const readLegacyField: LegacyFieldReader = (container, field, context) =>
      this.readLegacyField(container, field, context);

    return {
      version: '2026-03-03',
      description:
        'TODO: explain that this version allows to a more robust API models, reducing risk of breakings changes and adding consistency in naming',
      requestChanges: [],
      responseChanges: [
        new RenameUniqueIdentifier(),
        new RemoveMongoObjectId(readLegacyField),
        new RenameSeoUrl(),
        new IsoFormatOnUpdatedAt(),
        new ReplaceEntityByContacts(),
        new ReplaceServicesAllByServices(),
        new ReplaceTempInfosByTemporaryInformation(),
        new ReplaceModalitiesByAccess(),
        new ReplacePublicsByAudience(),
        new RemoveLegacyAutoFlag(readLegacyField),
        new RemoveLegacyStatusField(readLegacyField),
        new RemoveLegacyVisibilityField(readLegacyField),
        new RemoveLegacyCloseField(readLegacyField),
        new RemoveLegacySourcesField(readLegacyField),
        new RemoveLegacyUpdatedByUserAtField(readLegacyField),
        new RemoveLegacySlugsField(readLegacyField),
        new RemoveLegacyDistanceField(readLegacyField),
        new RemoveLegacyPhotosField(readLegacyField),
        new RemoveLegacyGeoZonesField(readLegacyField),
        new RemoveLegacyCreatedAtField(readLegacyField),
        new ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches(),
      ],
      prepareResponseDowngradeContext: async (payload, context) =>
        this.prepareResponseDowngradeContext(payload, context),
    };
  }

  private async prepareResponseDowngradeContext(
    payload: unknown,
    context: ResponseDowngradeContext,
  ): Promise<void> {
    const placeIds = this.extractPlaceIds(payload);
    const legacyById =
      placeIds.length === 0
        ? new Map<string, V20260303LegacyPlaceSnapshot>()
        : await this.legacySnapshotReader.readByCanonicalIds(placeIds);

    (context as V20260303ResponseDowngradeContextContainer).v20260303 = {
      legacyById,
    };
  }

  private readLegacyField(
    container: Record<string, unknown>,
    field: string,
    context?: ResponseDowngradeContext,
  ): unknown {
    const placeId = container.id;
    if (typeof placeId !== 'string' && typeof placeId !== 'number') {
      return undefined;
    }

    const legacyById = (
      context as V20260303ResponseDowngradeContextContainer | undefined
    )?.v20260303?.legacyById;

    return legacyById?.get(String(placeId))?.[field];
  }

  private extractPlaceIds(payload: unknown): string[] {
    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const places = (payload as { places?: unknown }).places;
    if (!Array.isArray(places)) {
      return [];
    }

    const ids = new Set<string>();

    for (const place of places) {
      if (!place || typeof place !== 'object') {
        continue;
      }

      const id = (place as Record<string, unknown>).id;
      if (typeof id === 'string' || typeof id === 'number') {
        ids.add(String(id));
      }
    }

    return [...ids];
  }
}

export const searchVersion20260303ChangeProviders = [
  MongoSearchV20260303LegacyPlaceSnapshotReader,
  {
    provide: SEARCH_V20260303_LEGACY_PLACE_SNAPSHOT_READER,
    useExisting: MongoSearchV20260303LegacyPlaceSnapshotReader,
  },
] as const;

export const searchVersion20260303VersionProviders = [
  SearchVersion20260303Provider,
] as const;

export const searchVersion20260303 =
  new SearchVersion20260303Provider().toVersion();
