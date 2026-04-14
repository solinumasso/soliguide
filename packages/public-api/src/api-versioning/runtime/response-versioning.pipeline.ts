import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VersionResolver } from '../versioning/version-resolver';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionMigrationPlanner } from './version-migration-planner';
import type { ResponseDowngradeContext } from '../versioning/versioning.types';

@Injectable()
export class ResponseVersioningPipeline {
  private readonly migrationPlanner: VersionMigrationPlanner;

  constructor(
    private readonly registry: VersionRegistry,
    private readonly versionResolver: VersionResolver,
  ) {
    this.migrationPlanner = new VersionMigrationPlanner(this.registry);
  }

  async downgradeResponse(
    payload: unknown,
    requestedVersion: string | null | undefined,
    context?: ResponseDowngradeContext,
  ): Promise<unknown> {
    const { normalizedVersion, isMissing } =
      this.versionResolver.resolveVersion(
        requestedVersion,
        this.registry.supportedVersions,
        this.registry.canonicalVersion,
      );

    if (isMissing || normalizedVersion === this.registry.canonicalVersion) {
      return payload;
    }

    const downgradePath = this.migrationPlanner.planResponseDowngradePath(
      this.registry.canonicalVersion,
      normalizedVersion,
    );

    const downgradeContext = context ?? {};
    let transformedPayload = payload;

    for (const version of downgradePath) {
      if (version.prepareResponseDowngradeContext) {
        try {
          await version.prepareResponseDowngradeContext(
            transformedPayload,
            downgradeContext,
          );
        } catch (error) {
          throw new InternalServerErrorException(
            `Failed to prepare response downgrade context for version ${version.version}.`,
            {
              cause: error,
            },
          );
        }
      }

      const responseChangesInDowngradeOrder = [
        ...version.responseChanges,
      ].reverse();

      for (const change of responseChangesInDowngradeOrder) {
        try {
          transformedPayload = await change.downgrade(
            transformedPayload,
            downgradeContext,
          );
        } catch (error) {
          throw new InternalServerErrorException(
            `Failed to apply response downgrade change "${change.description}" for version ${version.version}.`,
            {
              cause: error,
            },
          );
        }
      }
    }

    return transformedPayload;
  }
}
