export interface Environment {
  apiUrl: string;
  locationApiUrl: string;
  chatWebsiteId?: string;
  enableTracing: boolean;
  environment: "DEV" | "PROD" | "PREPROD";
  posthogUrl: string;
  posthogApiKey?: string;
  sentryDsn?: string;
  territoriesPresent: string;
  praticalFilesLink?: string;
  becomeTranslatorFormLink?: string;
  proAccountCreationFormLink?: string;
  donateLink?: string;
}
