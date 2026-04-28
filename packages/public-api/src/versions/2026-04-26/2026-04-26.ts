import { defineVersion, resource } from "../../versioning-engine/dsl";
import v20260101SearchRequestSchema from "../2026-01-01/2026-01-01.search-request.schema.generated";
import v20260101SearchResponseSchema from "../2026-01-01/2026-01-01.search-response.schema.generated";
import { searchRequestChanges } from "./changes/search-request.changes";
import { searchResponseChanges } from "./changes/search-response.changes";
import { V20260426_CONTEXT_PROVIDER } from "./runtime/context";

export default defineVersion({
  version: "2026-04-26",
  baseVersion: "2026-01-01",
  resources: [
    resource<typeof v20260101SearchRequestSchema>("search-request", {
      kind: "request",
      contextProvider: V20260426_CONTEXT_PROVIDER,
      changes: searchRequestChanges,
    }),
    resource<typeof v20260101SearchResponseSchema>("search-response", {
      kind: "response",
      contextProvider: V20260426_CONTEXT_PROVIDER,
      changes: searchResponseChanges,
    }),
  ],
});
