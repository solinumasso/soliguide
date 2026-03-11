import { Injectable, OnModuleInit } from '@nestjs/common';
import { buildResourceVersionToken } from './versioning/version-mapper.tokens';
import { VersionMapperService } from './versioning/version-mapper.service';
import { VersioningResourceConfig } from './versioning/version-mapper.types';

export const SEARCH_RESPONSE_VERSIONS: readonly string[] = [
  '2026-03-03',
  '2026-03-09',
];

export const SEARCH_RESPONSE_CANONICAL_VERSION =
  SEARCH_RESPONSE_VERSIONS[SEARCH_RESPONSE_VERSIONS.length - 1];

export const SEARCH_RESPONSE_DOWNGRADE_RESOURCE = 'search_response_downgrade';
export const SEARCH_REQUEST_UPGRADE_RESOURCE = 'search_request_upgrade';

export const SEARCH_RESPONSE_DOWNGRADE_CONFIG: VersioningResourceConfig = {
  resource: SEARCH_RESPONSE_DOWNGRADE_RESOURCE,
  versions: SEARCH_RESPONSE_VERSIONS,
  canonicalVersion: SEARCH_RESPONSE_CANONICAL_VERSION,
};

export const SEARCH_REQUEST_UPGRADE_CONFIG: VersioningResourceConfig = {
  resource: SEARCH_REQUEST_UPGRADE_RESOURCE,
  versions: SEARCH_RESPONSE_VERSIONS,
  canonicalVersion: SEARCH_RESPONSE_CANONICAL_VERSION,
};

export const searchResponseDowngradeMapperToken = (version: string): string =>
  buildResourceVersionToken(SEARCH_RESPONSE_DOWNGRADE_RESOURCE, version);

export const searchRequestUpgradeMapperToken = (version: string): string =>
  buildResourceVersionToken(SEARCH_REQUEST_UPGRADE_RESOURCE, version);

@Injectable()
export class SearchResponseDowngradeMappersStartupValidator implements OnModuleInit {
  constructor(private readonly versionMapperService: VersionMapperService) {}

  onModuleInit(): void {
    this.versionMapperService.validateDowngradeChain(
      SEARCH_RESPONSE_DOWNGRADE_CONFIG,
    );
  }
}
