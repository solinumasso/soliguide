import {
  baseSearchRequestOpenApiSchema,
  baseSearchRequestSchema,
  baseSearchResponseOpenApiSchema,
  baseSearchResponseSchema,
} from './search.base';
import {
  searchVersion20260303ChangeProviders,
  searchVersion20260303,
  searchVersion20260303VersionProviders,
} from '../versions/20260303.version';
import {
  searchVersion20260309ChangeProviders,
  searchVersion20260309,
  searchVersion20260309VersionProviders,
} from '../versions/20260309.version';
import type {
  OpenApiOperationTarget,
  Version,
  VersioningDefinition,
} from '../../api-versioning/versioning/versioning.types';

export const searchVersions: readonly Version[] = [
  searchVersion20260303,
  searchVersion20260309,
];

export interface SearchVersionProvider {
  toVersion(): Version;
}

export const searchVersionProviders = [
  ...searchVersion20260303VersionProviders,
  ...searchVersion20260309VersionProviders,
] as const;

export const searchVersionChangeProviders = [
  ...searchVersion20260303ChangeProviders,
  ...searchVersion20260309ChangeProviders,
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
    baseRequestSchema: baseSearchRequestSchema,
    baseResponseSchema: baseSearchResponseSchema,
    baseRequestOpenApiSchema: baseSearchRequestOpenApiSchema,
    baseResponseOpenApiSchema: baseSearchResponseOpenApiSchema,
  };
}

export const searchVersioningDefinition: VersioningDefinition =
  buildSearchVersioningDefinition(searchVersions);

export const searchOpenApiOperationTarget: OpenApiOperationTarget = {
  method: 'get',
  path: '/search',
};
