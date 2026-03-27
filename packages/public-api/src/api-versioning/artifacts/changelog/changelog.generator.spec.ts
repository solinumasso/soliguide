import type { CompiledVersion } from '../../versioning/versioning.types';
import { ChangelogGenerator } from './changelog.generator';

describe('ChangelogGenerator', () => {
  const changelogGenerator = new ChangelogGenerator();

  it('renders version changelog with request and response bullets', () => {
    const compiledVersion: CompiledVersion = {
      version: '2026-03-09',
      description: 'Canonical catalog payload format.',
      requestChanges: [
        {
          description: 'Renamed request field openToday to isOpenToday',
          schemaPatch: { payloadPath: '/' },
          upgrade: (payload) => payload,
        },
      ],
      responseChanges: [
        {
          description: 'Renamed response field slug to seoUrl',
          schemaPatch: { payloadPath: '/' },
          downgrade: (payload) => payload,
        },
      ],
    };

    const result = changelogGenerator.buildVersionChangelog(compiledVersion);

    expect(result).toContain('# 2026-03-09');
    expect(result).toContain('Canonical catalog payload format.');
    expect(result).toContain('## Request Changes');
    expect(result).toContain('- Renamed request field openToday to isOpenToday');
    expect(result).toContain('## Response Changes');
    expect(result).toContain('- Renamed response field slug to seoUrl');
  });

  it('uses initial-version fallback when there are no changes', () => {
    const compiledVersion: CompiledVersion = {
      version: '2026-03-03',
      description: 'Initial version.',
      requestChanges: [],
      responseChanges: [],
    };

    const result = changelogGenerator.buildVersionChangelog(compiledVersion);

    const fallback = '- Initial version (no diff from previous version).';
    expect(result).toContain('## Request Changes');
    expect(result).toContain('## Response Changes');
    expect(result.split(fallback)).toHaveLength(3);
  });
});
