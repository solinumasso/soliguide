import type {
  OpenApiOperationTarget,
  Version,
  VersioningDefinition,
} from '../../api-versioning/versioning/versioning.types';
import {
  SearchVersion20260323Provider,
  searchVersion20260323VersionProviders,
} from '../versions/20260323.version';
import { searchRequestSchema } from './search.request/search.request';
import { searchResponseSchema } from './search.response/search.response';

export const searchVersions: readonly Version[] = [
  new SearchVersion20260323Provider().toVersion(),
];

export interface SearchVersionProvider {
  toVersion(): Version;
}

export const searchVersionProviders = [
  ...searchVersion20260323VersionProviders,
] as const;

export const searchVersionChangeProviders = [
  ...searchVersion20260323VersionProviders,
] as const;

export function buildSearchVersions(
  providers: readonly SearchVersionProvider[],
): readonly Version[] {
  return providers.map((provider) => provider.toVersion());
}

export function buildSearchVersioningDefinition(
  versions: readonly Version[],
): VersioningDefinition {
  return {
    resource: 'search',
    versions,
    baseRequestSchema: searchRequestSchema,
    baseResponseSchema: searchResponseSchema,
  };
}

export const searchVersioningDefinition: VersioningDefinition =
  buildSearchVersioningDefinition(searchVersions);

export const searchOpenApiOperationTarget: OpenApiOperationTarget = {
  method: 'get',
  path: '/search',
};
