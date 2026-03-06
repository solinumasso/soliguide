import type { Environment } from "../app/shared/types/Environment.type";

export const environment: Environment = {
  // Sensible defaults
  posthogUrl: "https://eu.posthog.com",
  enableTracing: false,
  territoriesPresent: "38",
  // Taking values from index.html
  ...window.CURRENT_DATA.env,
} as const;
