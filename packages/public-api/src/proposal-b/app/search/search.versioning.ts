import {
  baseSearchRequestOpenApiSchema,
  baseSearchRequestSchema,
  baseSearchResponseOpenApiSchema,
  baseSearchResponseSchema,
} from './search.base';
import { searchVersion20260303 } from './versions/20260303.version';
import { searchVersion20260309 } from './versions/20260309.version';
import type {
  OpenApiOperationTarget,
  Version,
  VersioningDefinition,
} from '../../versioning/versioning.types';

export const searchVersions: readonly Version[] = [
  searchVersion20260303,
  searchVersion20260309,
];

export const searchVersioningDefinition: VersioningDefinition = {
  resource: 'search',
  versions: searchVersions,
  baseRequestSchema: baseSearchRequestSchema,
  baseResponseSchema: baseSearchResponseSchema,
  baseRequestOpenApiSchema: baseSearchRequestOpenApiSchema,
  baseResponseOpenApiSchema: baseSearchResponseOpenApiSchema,
};

export const searchOpenApiOperationTarget: OpenApiOperationTarget = {
  method: 'get',
  path: '/search',
};
