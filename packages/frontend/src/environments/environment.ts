import type { Environment } from "../app/shared/types/Environment.type";

export const environment: Environment = {
  apiUrl: "http://localhost:3001",
  locationApiUrl: "http://localhost:3000",
  enableTracing: false,
  environment: "DEV",
  posthogUrl: "https://eu.posthog.com",
  territoriesPresent: "38",
  praticalFilesLink: "https://fiches.soliguide.fr/hc",
  becomeTranslatorFormLink: "https://airtable.com/shrZHYio1ZdnPl1Et",
  proAccountCreationFormLink:
    "https://airtable.com/shrVIdI1OcUSpYXAP?prefill_Comment+vous+nous+avez+connu+?=Soliguide.fr",
  donateLink: "https://www.helloasso.com/associations/solinum/formulaires/1",
} as const;
