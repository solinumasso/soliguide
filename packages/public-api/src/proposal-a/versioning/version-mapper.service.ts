import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  DowngradeMapper,
  UpgradeMapper,
  VersioningResourceConfig,
} from './version-mapper.types';
import {
  buildResourceVersionToken,
  normalizeVersion,
} from './version-mapper.tokens';

export interface ApplyDowngradeChainOptions extends VersioningResourceConfig {
  targetVersion: string | null;
  payload: unknown;
}

export interface ApplyUpgradeChainOptions extends VersioningResourceConfig {
  sourceVersion: string | null;
  payload: unknown;
}

@Injectable()
export class VersionMapperService {
  constructor(@Inject(ModuleRef) private readonly moduleRef: ModuleRef) {}

  private tryGetMapper<TMapper>(token: string): TMapper | undefined {
    try {
      return this.moduleRef.get<TMapper>(token, { strict: false });
    } catch {
      return undefined;
    }
  }

  applyDowngradeChain(options: ApplyDowngradeChainOptions): unknown {
    if (!options.targetVersion) {
      return options.payload;
    }

    const targetVersion = normalizeVersion(options.targetVersion);
    const targetIndex = options.versions.indexOf(targetVersion);
    const canonicalIndex = options.versions.indexOf(options.canonicalVersion);

    if (
      targetIndex === -1 ||
      canonicalIndex === -1 ||
      targetIndex > canonicalIndex
    ) {
      return options.payload;
    }

    let transformedPayload = options.payload;
    for (
      let versionIndex = canonicalIndex;
      versionIndex > targetIndex;
      versionIndex--
    ) {
      const sourceVersion = options.versions[versionIndex];
      const targetStepVersion = options.versions[versionIndex - 1];
      const mapperToken = buildResourceVersionToken(
        options.resource,
        sourceVersion,
      );
      const mapper = this.tryGetMapper<DowngradeMapper>(mapperToken);

      if (!mapper) {
        throw new Error(
          `Missing mapper "${mapperToken}" to downgrade ${options.resource} from ${sourceVersion} to ${targetStepVersion}.`,
        );
      }

      transformedPayload = mapper.downgrade(transformedPayload);
    }

    return transformedPayload;
  }

  applyUpgradeChain(options: ApplyUpgradeChainOptions): unknown {
    if (!options.sourceVersion) {
      return options.payload;
    }

    const sourceVersion = normalizeVersion(options.sourceVersion);
    const sourceIndex = options.versions.indexOf(sourceVersion);
    const canonicalIndex = options.versions.indexOf(options.canonicalVersion);

    if (
      sourceIndex === -1 ||
      canonicalIndex === -1 ||
      sourceIndex >= canonicalIndex
    ) {
      return options.payload;
    }

    let transformedPayload = options.payload;
    for (
      let versionIndex = sourceIndex;
      versionIndex < canonicalIndex;
      versionIndex++
    ) {
      const sourceStepVersion = options.versions[versionIndex];
      const targetStepVersion = options.versions[versionIndex + 1];
      const mapperToken = buildResourceVersionToken(
        options.resource,
        sourceStepVersion,
      );
      const mapper = this.tryGetMapper<UpgradeMapper>(mapperToken);

      if (!mapper) {
        throw new Error(
          `Missing mapper "${mapperToken}" to upgrade ${options.resource} from ${sourceStepVersion} to ${targetStepVersion}.`,
        );
      }

      transformedPayload = mapper.upgrade(transformedPayload);
    }

    return transformedPayload;
  }

  validateDowngradeChain(config: VersioningResourceConfig): void {
    const canonicalIndex = config.versions.indexOf(config.canonicalVersion);
    if (canonicalIndex === -1) {
      throw new Error(
        `Canonical version "${config.canonicalVersion}" is missing from versions for ${config.resource}.`,
      );
    }

    for (let versionIndex = canonicalIndex; versionIndex > 0; versionIndex--) {
      const sourceVersion = config.versions[versionIndex];
      const targetVersion = config.versions[versionIndex - 1];
      const mapperToken = buildResourceVersionToken(
        config.resource,
        sourceVersion,
      );
      const mapper = this.tryGetMapper<DowngradeMapper>(mapperToken);

      if (!mapper) {
        throw new Error(
          `Missing mapper "${mapperToken}" to downgrade ${config.resource} from ${sourceVersion} to ${targetVersion}.`,
        );
      }
    }
  }

  validateUpgradeChain(config: VersioningResourceConfig): void {
    const canonicalIndex = config.versions.indexOf(config.canonicalVersion);
    if (canonicalIndex === -1) {
      throw new Error(
        `Canonical version "${config.canonicalVersion}" is missing from versions for ${config.resource}.`,
      );
    }

    for (let versionIndex = 0; versionIndex < canonicalIndex; versionIndex++) {
      const sourceVersion = config.versions[versionIndex];
      const targetVersion = config.versions[versionIndex + 1];
      const mapperToken = buildResourceVersionToken(
        config.resource,
        sourceVersion,
      );
      const mapper = this.tryGetMapper<UpgradeMapper>(mapperToken);

      if (!mapper) {
        throw new Error(
          `Missing mapper "${mapperToken}" to upgrade ${config.resource} from ${sourceVersion} to ${targetVersion}.`,
        );
      }
    }
  }
}
