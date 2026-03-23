import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VersionResolver } from '../versioning/version-resolver';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionMigrationPlanner } from './version-migration-planner';

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

    let transformedPayload = payload;

    for (const version of downgradePath) {
      for (const change of version.responseChanges) {
        try {
          transformedPayload = await change.downgrade(transformedPayload);
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
