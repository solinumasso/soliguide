import { VersionRegistry } from "../../versioning-engine";
import v20260101PlaceResponseSchema from "./2026-01-01.place-response.schema.generated";
import v20260101SearchRequestSchema from "./2026-01-01.search-request.schema.generated";
import v20260101SearchResponseSchema from "./2026-01-01.search-response.schema.generated";

export const versionRegistry: VersionRegistry = {
  "search-places": {
    openApi: {
      requestSchema: v20260101SearchRequestSchema,
      responses: {
        200: v20260101SearchResponseSchema,
      },
    },
  },
  "get-place": {
    openApi: {
      responses: {
        200: v20260101PlaceResponseSchema,
      },
    },
  },
};

export default versionRegistry;
