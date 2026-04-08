import { Injectable } from '@nestjs/common';
import { Version } from '../../../../api-versioning/versioning';
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

@Injectable()
export class SearchVersion20260303Provider {
  toVersion(): Version {
    return {
      version: '2026-03-03',
      description:
        'TODO: explain that this version allows to a more robust API models, reducing risk of breakings changes and adding consistency in naming',
      requestChanges: [],
      responseChanges: [
        new RenameUniqueIdentifier(),
        new RemoveMongoObjectId(),
        new RenameSeoUrl(),
        new IsoFormatOnUpdatedAt(),
        new ReplaceEntityByContacts(),
        new ReplaceServicesAllByServices(),
        new ReplaceTempInfosByTemporaryInformation(),
        new ReplaceModalitiesByAccess(),
        new ReplacePublicsByAudience(),
        new RemoveLegacyAutoFlag(),
        new RemoveLegacyStatusField(),
        new RemoveLegacyVisibilityField(),
        new RemoveLegacyCloseField(),
        new RemoveLegacySourcesField(),
        new RemoveLegacyUpdatedByUserAtField(),
        new RemoveLegacySlugsField(),
        new RemoveLegacyDistanceField(),
        new RemoveLegacyPhotosField(),
        new RemoveLegacyGeoZonesField(),
        new RemoveLegacyCreatedAtField(),
        new ReplaceLegacyPlaceTypeByTypeDiscriminatedBranches(),
      ],
    };
  }
}

export const searchVersion20260303ChangeProviders: [] = [];
export const searchVersion20260303VersionProviders = [
  SearchVersion20260303Provider,
];

export const searchVersion20260303 =
  new SearchVersion20260303Provider().toVersion();
