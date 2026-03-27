import { Injectable } from '@nestjs/common';
import { Version } from '../../api-versioning/versioning';

@Injectable()
export class SearchVersion20260323Provider {
  toVersion(): Version {
    return {
      version: '2026-03-23',
      description: 'Initial public search API contract.',
      requestChanges: [],
      responseChanges: [],
    };
  }
}

export const searchVersion20260323ChangeProviders: [] = [];
export const searchVersion20260323VersionProviders = [
  SearchVersion20260323Provider,
];

export const searchVersion20260323 =
  new SearchVersion20260323Provider().toVersion();
