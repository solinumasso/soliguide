import { describe, expect, it, vi } from 'vitest';
import { DslCompiler } from '../../../../api-versioning/versioning';
import { SearchVersion20260303Provider } from './20260303.version';
import type {
  SearchV20260303LegacyPlaceSnapshotReader,
  V20260303LegacyPlaceSnapshot,
} from './2026-03-03.legacy-place-snapshot-reader.port';

describe('SearchVersion20260303Provider', () => {
  it('wires response changes in the expected deterministic order', () => {
    const version = new SearchVersion20260303Provider().toVersion();

    expect(
      version.responseChanges.map((change) => change.constructor.name),
    ).toEqual([
      'RenameUniqueIdentifier',
      'RemoveMongoObjectId',
      'RenameSeoUrl',
      'IsoFormatOnUpdatedAt',
      'ReplaceEntityByContacts',
      'ReplaceServicesAllByServices',
      'ReplaceTempInfosByTemporaryInformation',
      'ReplaceModalitiesByAccess',
      'ReplacePublicsByAudience',
      'RemoveLegacyAutoFlag',
      'RemoveLegacyStatusField',
      'RemoveLegacyVisibilityField',
      'RemoveLegacyCloseField',
      'RemoveLegacySourcesField',
      'RemoveLegacyUpdatedByUserAtField',
      'RemoveLegacySlugsField',
      'RemoveLegacyDistanceField',
      'RemoveLegacyPhotosField',
      'RemoveLegacyGeoZonesField',
      'RemoveLegacyCreatedAtField',
      'ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches',
    ]);
  });

  it('preloads legacy snapshots once per response downgrade run', async () => {
    const snapshots = new Map<string, V20260303LegacyPlaceSnapshot>([
      ['1', { _id: 'mongo-1' }],
      ['2', { _id: 'mongo-2' }],
    ]);
    const readByCanonicalIds = vi.fn(
      (): Promise<ReadonlyMap<string, V20260303LegacyPlaceSnapshot>> =>
        Promise.resolve(snapshots),
    );

    const legacySnapshotReader: SearchV20260303LegacyPlaceSnapshotReader = {
      readByCanonicalIds,
    };

    const version = new SearchVersion20260303Provider(
      legacySnapshotReader,
    ).toVersion();

    const context: Record<string, unknown> = {};
    await version.prepareResponseDowngradeContext?.(
      {
        places: [{ id: 1 }, { id: '2' }, { id: '2' }],
      },
      context,
    );

    expect(readByCanonicalIds).toHaveBeenCalledTimes(1);
    expect(readByCanonicalIds).toHaveBeenCalledWith(['1', '2']);
    expect(context).toEqual({
      v20260303: {
        legacyById: snapshots,
      },
    });
  });

  it('uses prepared context to restore removed _id during downgrade', async () => {
    const snapshots = new Map<string, V20260303LegacyPlaceSnapshot>([
      ['1', { _id: '507f1f77bcf86cd799439011' }],
    ]);
    const readByCanonicalIds = vi.fn(
      (): Promise<ReadonlyMap<string, V20260303LegacyPlaceSnapshot>> =>
        Promise.resolve(snapshots),
    );

    const legacySnapshotReader: SearchV20260303LegacyPlaceSnapshotReader = {
      readByCanonicalIds,
    };

    const version = new SearchVersion20260303Provider(
      legacySnapshotReader,
    ).toVersion();

    const removeMongoObjectId = version.responseChanges.find(
      (change) =>
        'field' in change && (change as { field?: unknown }).field === '_id',
    );

    expect(removeMongoObjectId).toBeDefined();

    const context: Record<string, unknown> = {};
    await version.prepareResponseDowngradeContext?.(
      {
        places: [{ id: 1 }],
      },
      context,
    );

    const downgraded = await new DslCompiler()
      .compileResponseChange(removeMongoObjectId!)
      .downgrade(
        {
          places: [{ id: 1 }],
        },
        context,
      );

    expect(
      (downgraded as { places: Array<Record<string, unknown>> }).places[0],
    ).toEqual({
      id: 1,
      _id: '507f1f77bcf86cd799439011',
    });
  });
});
