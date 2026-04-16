import { VersionRegistry } from "../versioning-engine/version-registry";
import v20260101Registry from "./2026-01-01/open-api.registry";

export const versionRegistry: Record<string, VersionRegistry> = {
  v20260101: v20260101Registry,
};
