import { describe, expect, it } from 'vitest';
import { SearchVersion20260303Provider } from './20260303.version';

describe('SearchVersion20260303Provider', () => {
  it('wires response changes in the expected deterministic order', () => {
    const version = new SearchVersion20260303Provider().toVersion();

    expect(version.responseChanges.map((change) => change.constructor.name)).toEqual([
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
});
