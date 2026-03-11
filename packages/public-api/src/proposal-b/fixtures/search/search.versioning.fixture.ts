// Fixture compatibility layer.
// Runtime app wiring should use proposal-b/search exports directly.
export {
  baseSearchRequestSchema,
  baseSearchResponseSchema,
  baseSearchRequestOpenApiSchema,
  baseSearchResponseOpenApiSchema,
  searchOpenApiOperationTarget,
  searchVersion20260303,
  searchVersion20260309,
  searchVersions,
  searchVersioningDefinition,
} from '../../app/search';
