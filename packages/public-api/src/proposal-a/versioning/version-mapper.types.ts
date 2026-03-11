export interface DowngradeMapper<
  UpperVersion = unknown,
  LowerVersion = unknown,
> {
  downgrade(payload: UpperVersion): LowerVersion;
}

export interface UpgradeMapper<LowerVersion = unknown, UpperVersion = unknown> {
  upgrade(payload: LowerVersion): UpperVersion;
}

export interface VersioningResourceConfig {
  resource: string;
  versions: readonly string[];
  canonicalVersion: string;
}
