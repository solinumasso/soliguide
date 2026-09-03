import {
  add,
  patch,
  remove,
  rename,
  replaceSchema,
  ResourceChangesFactory,
} from "../../../versioning-engine";
import { applyDowngradeChanges } from "../../../versioning-engine/runtime-pipeline/transformers";
import v20260101PlaceResponseSchema from "../../2026-01-01/2026-01-01.place-response.schema.generated";
import { placeByTypeSchema } from "./schemas";
import { searchResponseChanges } from "./search-response.changes";

const searchResponseRuntimeChanges = searchResponseChanges({
  add,
  patch,
  remove,
  rename,
  replaceSchema,
} as never);

const downgradePlaceResponse = async (payload: unknown, context: unknown) => {
  const response = (await applyDowngradeChanges(
    { places: [payload] },
    searchResponseRuntimeChanges,
    context
  )) as { places?: unknown[] };

  return response.places?.[0] ?? payload;
};

export const placeResponseChanges: ResourceChangesFactory<
  typeof v20260101PlaceResponseSchema,
  "response"
> = ({ replaceSchema }) => [
  replaceSchema({
    payloadPath: "",
    schema: placeByTypeSchema,
    downgrade: downgradePlaceResponse,
  }),
];
