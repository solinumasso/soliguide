import type {
  ApiVersion,
  CompiledVersion,
} from '../versioning/versioning.types';
import { VersionRegistry } from '../versioning/version-registry';

export class VersionMigrationPlanner {
  constructor(private readonly registry: VersionRegistry) {}

  planRequestUpgradePath(
    sourceVersion: ApiVersion,
    targetVersion: ApiVersion,
  ): readonly CompiledVersion[] {
    const sourceIndex = this.registry.getVersionIndex(sourceVersion);
    const targetIndex = this.registry.getVersionIndex(targetVersion);

    if (
      sourceIndex === -1 ||
      targetIndex === -1 ||
      sourceIndex >= targetIndex
    ) {
      return [];
    }

    const versions: CompiledVersion[] = [];

    for (
      let versionIndex = sourceIndex + 1;
      versionIndex <= targetIndex;
      versionIndex += 1
    ) {
      versions.push(this.registry.getCompiledVersionByIndex(versionIndex));
    }

    return versions;
  }

  planResponseDowngradePath(
    sourceVersion: ApiVersion,
    targetVersion: ApiVersion,
  ): readonly CompiledVersion[] {
    const sourceIndex = this.registry.getVersionIndex(sourceVersion);
    const targetIndex = this.registry.getVersionIndex(targetVersion);

    if (
      sourceIndex === -1 ||
      targetIndex === -1 ||
      sourceIndex <= targetIndex
    ) {
      return [];
    }

    const versions: CompiledVersion[] = [];

    for (
      let versionIndex = sourceIndex;
      versionIndex > targetIndex;
      versionIndex -= 1
    ) {
      versions.push(this.registry.getCompiledVersionByIndex(versionIndex));
    }

    return versions;
  }
}
