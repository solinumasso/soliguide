import { Injectable } from '@nestjs/common';
import { Version, defineVersion } from '../../api-versioning/versioning';

@Injectable()
export class SearchVersion20260303Provider {
  toVersion(): Version {
    return defineVersion({
      version: '2026-03-03',
      description: 'Initial public search API version.',
      requestChanges: [],
      responseChanges: [],
    });
  }
}

export const searchVersion20260303ChangeProviders: [] = [];
export const searchVersion20260303VersionProviders = [
  SearchVersion20260303Provider,
];

export const searchVersion20260303 =
  new SearchVersion20260303Provider().toVersion();
