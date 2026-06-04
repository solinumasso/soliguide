import { DocExportRow } from "@soliguide/common";

import { logger } from "../../general/logger";
import { stripXmlControlChars } from "../../_utils/functions/xml-control-chars";

export const sanitizeDocExportRow = (row: DocExportRow): DocExportRow => {
  const sanitized = { ...row };
  let removedCount = 0;

  for (const key of Object.keys(sanitized) as (keyof DocExportRow)[]) {
    const value = sanitized[key];
    if (typeof value === "string") {
      const sanitizedValue = stripXmlControlChars(value);
      removedCount += value.length - sanitizedValue.length;
      (sanitized as Record<string, unknown>)[key] = sanitizedValue;
    }
  }

  if (removedCount > 0) {
    logger.warn(
      { lieu_id: row.lieu_id, removedCount },
      "Invalid XML characters removed from export row"
    );
  }

  return sanitized;
};
