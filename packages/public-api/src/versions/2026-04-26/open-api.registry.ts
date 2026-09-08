import { VersionRegistry } from "../../versioning-engine";
import v20260426PlaceResponseSchema from "./2026-04-26.place-response.schema.generated";
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
  "get-place": {
    openApi: {
      responses: {
        200: v20260426PlaceResponseSchema,
      },
    },
  },
};

export default versionRegistry;
