import { VersionRegistry } from "src/versioning-engine/open-api/version-registry";
import v20260426SearchRequestSchema from "./2026-04-26.search-request.schema.generated";
import v20260426SearchResponseSchema from "./2026-04-26.search-response.schema.generated";

export const versionRegistry: VersionRegistry = {
  "search-places": {
    openApi: {
      requestSchema: v20260426SearchRequestSchema,
      responses: {
        200: v20260426SearchResponseSchema,
      },
    },
  },
};

export default versionRegistry;
