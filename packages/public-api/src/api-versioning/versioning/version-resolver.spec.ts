import { BadRequestException } from '@nestjs/common';
import { VersionResolver } from './version-resolver';
import { ApiVersion } from './versioning.types';

describe('ProposalC VersionResolver', () => {
  const supportedVersions = ['2026-03-03', '2026-03-09'] as const;
  const canonicalVersion = '2026-03-09' as ApiVersion;

  let resolver: VersionResolver;

  beforeEach(() => {
    resolver = new VersionResolver();
  });

  it('returns canonical version when version is missing', () => {
    expect(
      resolver.resolveVersion(undefined, supportedVersions, canonicalVersion),
    ).toEqual({ normalizedVersion: canonicalVersion, isMissing: true });
  });

  it('normalizes versions with v prefix', () => {
    expect(
      resolver.resolveVersion(
        'v2026-03-03',
        supportedVersions,
        canonicalVersion,
      ),
    ).toEqual({ normalizedVersion: '2026-03-03', isMissing: false });
  });

  it('throws for malformed version strings', () => {
    expect(() =>
      resolver.resolveVersion(
        '03-09-2026',
        supportedVersions,
        canonicalVersion,
      ),
    ).toThrow(BadRequestException);
  });

  it('throws for invalid calendar dates', () => {
    expect(() =>
      resolver.resolveVersion(
        '2026-02-30',
        supportedVersions,
        canonicalVersion,
      ),
    ).toThrow(BadRequestException);
  });

  it('throws for unsupported versions', () => {
    expect(() =>
      resolver.resolveVersion(
        '2026-03-10',
        supportedVersions,
        canonicalVersion,
      ),
    ).toThrow(BadRequestException);
  });
});
