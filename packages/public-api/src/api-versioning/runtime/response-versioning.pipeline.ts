import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { VersionResolver } from '../versioning/version-resolver';
import { VersionRegistry } from '../versioning/version-registry';

@Injectable()
export class ResponseVersioningPipeline {
  constructor(
    private readonly registry: VersionRegistry,
    private readonly versionResolver: VersionResolver,
  ) {}

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

    const targetIndex = this.registry.getVersionIndex(normalizedVersion);
    const canonicalIndex = this.registry.getVersionIndex(
      this.registry.canonicalVersion,
    );

    let transformedPayload = payload;

    for (
      let versionIndex = canonicalIndex;
      versionIndex > targetIndex;
      versionIndex -= 1
    ) {
      const version = this.registry.getCompiledVersionByIndex(versionIndex);

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
