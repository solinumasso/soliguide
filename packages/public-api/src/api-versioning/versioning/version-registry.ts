import { Injectable } from '@nestjs/common';
import { DslCompiler } from './dsl-compiler';
import { VersionDefinitionValidator } from './version-definition.validator';
import type {
  ApiVersion,
  CompiledVersion,
  Version,
  VersioningDefinition,
} from './versioning.types';

@Injectable()
export class VersionRegistry {
  readonly definition: VersioningDefinition;
  readonly versions: readonly Version[];
  readonly compiledVersions: readonly CompiledVersion[];
  readonly supportedVersions: readonly ApiVersion[];
  readonly canonicalVersion: ApiVersion;

  constructor(
    definition: VersioningDefinition,
    compiler?: DslCompiler,
    validator?: VersionDefinitionValidator,
  ) {
    this.definition = definition;
    this.versions = definition.versions;

    const definitionValidator = validator ?? new VersionDefinitionValidator();
    definitionValidator.validateDefinition(this.definition);

    this.supportedVersions = this.versions.map((version) => version.version);
    this.canonicalVersion =
      this.supportedVersions[this.supportedVersions.length - 1];

    const dslCompiler = compiler ?? new DslCompiler();
    this.compiledVersions = dslCompiler.compileVersions(this.versions);
  }

  getVersionIndex(version: ApiVersion): number {
    return this.supportedVersions.indexOf(version);
  }

  getVersionByIndex(index: number): Version {
    return this.versions[index];
  }

  getCompiledVersionByIndex(index: number): CompiledVersion {
    return this.compiledVersions[index];
  }
}
