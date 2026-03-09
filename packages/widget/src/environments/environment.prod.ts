import { Environment } from "./Environment.type";

declare global {
  interface Window {
    CURRENT_DATA: Environment;
  }
}

export const environment: Environment = {
  // Taking values from index.html
  ...window.CURRENT_DATA,
} as const;
