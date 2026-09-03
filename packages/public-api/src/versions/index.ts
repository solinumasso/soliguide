import { VersionRegistry } from "../versioning-engine";
import v20260101Registry from "./2026-01-01/open-api.registry";
import v20260426Registry from "./2026-04-26/open-api.registry";

export const versionRegistry: Record<string, VersionRegistry> = {
  v20260101: v20260101Registry,
  v20260426: v20260426Registry,
};
