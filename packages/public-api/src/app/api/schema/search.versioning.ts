import type {
  OpenApiOperationTarget,
  Version,
  VersioningDefinition,
} from '../../../api-versioning/versioning/versioning.types';
import {
  searchVersion20260101,
  searchVersion20260101ChangeProviders,
  searchVersion20260101VersionProviders,
} from './2026-01-01/20260101.version';
import {
  searchVersion20260303,
  searchVersion20260303ChangeProviders,
  searchVersion20260303VersionProviders,
} from './2026-03-03/20260303.version';
import { v20260101SearchRequestSchema } from './2026-01-01/search.request/2026-01-01.search.request';
import { v20260101SearchResponseSchema } from './2026-01-01/search.response/2026-01-01.search.response';
export const searchVersions: readonly Version[] = [
  searchVersion20260101,
  searchVersion20260303,
];

export interface SearchVersionProvider {
  toVersion(): Version;
}

export const searchVersionProviders = [
  ...searchVersion20260101VersionProviders,
  ...searchVersion20260303VersionProviders,
] as const;

export const searchVersionChangeProviders = [
  ...searchVersion20260101ChangeProviders,
  ...searchVersion20260303ChangeProviders,
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
    baseRequestSchema: v20260101SearchRequestSchema,
    baseResponseSchema: v20260101SearchResponseSchema,
  };
}

export const searchVersioningDefinition: VersioningDefinition =
  buildSearchVersioningDefinition(searchVersions);

export const searchOpenApiOperationTarget: OpenApiOperationTarget = {
  method: 'post',
  path: '/search',
};
