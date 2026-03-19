import { VersionRegistry, DslCompiler } from '../../api-versioning/versioning';
import { searchVersion20260303 } from '../versions/20260303.version';
import { searchVersion20260309 } from '../versions/20260309.version';
import {
  searchVersions,
  searchVersioningDefinition,
  searchOpenApiOperationTarget,
} from './search.versioning';

describe('ProposalC Search versioning configuration', () => {
  it('composes versions from per-version files in chronological order', () => {
    expect(searchVersions).toEqual([
      searchVersion20260303,
      searchVersion20260309,
    ]);

    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );

    expect(registry.supportedVersions).toEqual(['2026-03-03', '2026-03-09']);
    expect(registry.canonicalVersion).toBe('2026-03-09');
  });

  it('declares the openapi operation target used for search artifacts', () => {
    expect(searchOpenApiOperationTarget).toEqual({
      method: 'get',
      path: '/search',
    });
  });
});
