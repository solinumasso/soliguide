import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiVersion, ResolvedVersion } from './versioning.types';

const VERSION_PATTERN = /^v?(\d{4}-\d{2}-\d{2})$/i;

export function normalizeVersion(version: string): ApiVersion {
  return version.trim().replace(/^v/i, '') as ApiVersion;
}

function isValidDateLiteral(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === value;
}

@Injectable()
export class VersionResolver {
  resolveVersion(
    requestedVersion: string | null | undefined,
    supportedVersions: readonly ApiVersion[],
    canonicalVersion: ApiVersion,
  ): ResolvedVersion {
    if (
      requestedVersion === undefined ||
      requestedVersion === null ||
      requestedVersion.trim().length === 0
    ) {
      return {
        normalizedVersion: canonicalVersion,
        isMissing: true,
      };
    }

    if (!VERSION_PATTERN.test(requestedVersion.trim())) {
      throw new BadRequestException(
        `Invalid API version format: "${requestedVersion}". Expected YYYY-MM-DD or vYYYY-MM-DD.`,
      );
    }

    const normalizedVersion = normalizeVersion(requestedVersion);

    if (!isValidDateLiteral(normalizedVersion)) {
      throw new BadRequestException(
        `Invalid API version date: "${requestedVersion}".`,
      );
    }

    if (!supportedVersions.includes(normalizedVersion)) {
      throw new BadRequestException(
        `Unsupported API version: "${requestedVersion}". Supported versions: ${supportedVersions.join(', ')}.`,
      );
    }

    return {
      normalizedVersion,
      isMissing: false,
    };
  }
}
