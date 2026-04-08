import { Injectable } from '@nestjs/common';
import { Version } from '../../../../api-versioning/versioning';

@Injectable()
export class SearchVersion20260101Provider {
  toVersion(): Version {
    return {
      version: '2026-01-01',
      description: 'Legacy search contract baseline.',
      requestChanges: [],
      responseChanges: [],
    };
  }
}

export const searchVersion20260101ChangeProviders: [] = [];
export const searchVersion20260101VersionProviders = [
  SearchVersion20260101Provider,
];

export const searchVersion20260101 =
  new SearchVersion20260101Provider().toVersion();
