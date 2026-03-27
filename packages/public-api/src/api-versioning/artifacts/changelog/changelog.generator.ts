import type { CompiledVersion } from '../../versioning/versioning.types';

export class ChangelogGenerator {
  buildVersionChangelog(compiledVersion: CompiledVersion): string {
    const lines = [
      `# ${compiledVersion.version}`,
      '',
      compiledVersion.description,
      '',
      '## Request Changes',
      ...this.formatVersionChanges(compiledVersion.requestChanges),
      '',
      '## Response Changes',
      ...this.formatVersionChanges(compiledVersion.responseChanges),
      '',
    ];

    return lines.join('\n');
  }

  private formatVersionChanges(
    changes: readonly { description: string }[],
  ): string[] {
    if (changes.length === 0) {
      return ['- Initial version (no diff from previous version).'];
    }

    return changes.map((change) => `- ${change.description}`);
  }
}
