export class PosthogConfig {
  public readonly posthogUrl: string;
  public readonly posthogLibraryName: string;
  public readonly posthogApiKey?: string;
  public readonly posthogDebug?: boolean;
  public readonly soliguideApiUrl: string;

  public constructor(
    posthogUrl: string,
    posthogLibraryName: string,
    soliguideApiUrl: string,
    posthogApiKey?: string,
    posthogDebug?: boolean
  ) {
    this.posthogUrl = posthogUrl;
    this.posthogLibraryName = posthogLibraryName;
    this.posthogApiKey = posthogApiKey;
    this.posthogDebug = posthogDebug;
    this.soliguideApiUrl = soliguideApiUrl;
  }
}
