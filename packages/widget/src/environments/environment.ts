import { Environment } from "./Environment.type";

/* eslint-disable no-template-curly-in-string */
export const environment: Environment = {
  widgetUrl: "http://localhost:4201",
  frontendUrl: "http://localhost:4200",
  locationApiUrl: "http://localhost:3000",
  apiUrl: "http://localhost:3001",
  environment: "DEV",
  posthogUrl: "https://eu.posthog.com",
  //posthogApiKey: "a super secret token",
};
