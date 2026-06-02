import { DocExportRow } from "@soliguide/common";

import { logger } from "../../general/logger";

// XML 1.0 forbids control characters except TAB (0x09), LF (0x0A) and CR (0x0D)
const INVALID_XML_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const sanitizeXmlString = (value: string): string =>
  value.replace(INVALID_XML_CHARS_REGEX, "");

export const sanitizeDocExportRow = (row: DocExportRow): DocExportRow => {
  const sanitized = { ...row };
  let removedCount = 0;

  for (const key of Object.keys(sanitized) as (keyof DocExportRow)[]) {
    const value = sanitized[key];
    if (typeof value === "string") {
      const sanitizedValue = sanitizeXmlString(value);
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
