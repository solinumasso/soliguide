import { AnyParsedChangeDefinition } from "./types";
import { splitPayloadPath } from "./schema-path-utils";

export function orderChangesForBaseSchemaPaths(
  changes: AnyParsedChangeDefinition[]
): AnyParsedChangeDefinition[] {
  return changes
    .map((change, index) => ({ change, index }))
    .sort((left, right) => {
      const depthDifference =
        getChangePathDepth(right.change) - getChangePathDepth(left.change);

      return depthDifference || left.index - right.index;
    })
    .map(({ change }) => change);
}

function getChangePathDepth(change: AnyParsedChangeDefinition): number {
  switch (change.type) {
    case "add":
    case "rename":
      return splitPayloadPath(change.payload.payloadPath).length + 1;
    case "remove":
    case "replaceSchema":
    case "patch":
      return splitPayloadPath(change.payload.payloadPath).length;
    default:
      return 0;
  }
}
