export interface Environment {
  frontendUrl: string;
  widgetUrl: string;
  locationApiUrl: string;
  apiUrl: string;
  environment: "DEV" | "PROD" | "PREPROD";
  posthogUrl: string;
  posthogApiKey?: string;
}
