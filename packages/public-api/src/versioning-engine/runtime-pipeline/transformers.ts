import type { RuntimeVersionChange } from "../dsl";

export type JsonRecord = Record<string, unknown>;
export type RuntimeTransform = (payload: unknown, context: unknown) => unknown;

export async function applyUpgradeChanges(
  payload: unknown,
  changes: RuntimeVersionChange[],
  context: unknown
): Promise<unknown> {
  let currentPayload = payload;

  for (const change of changes) {
    currentPayload = await applyUpgradeChange(currentPayload, change, context);
  }

  return currentPayload;
}

export async function applyDowngradeChanges(
  payload: unknown,
  changes: RuntimeVersionChange[],
  context: unknown
): Promise<unknown> {
  let currentPayload = payload;

  for (const change of [...changes].reverse()) {
    currentPayload = await applyDowngradeChange(
      currentPayload,
      change,
      context
    );
  }

  return currentPayload;
}

async function applyUpgradeChange(
  payload: unknown,
  change: RuntimeVersionChange,
  context: unknown
): Promise<unknown> {
  const runtime = change.payload;

  if (typeof runtime.upgrade === "function") {
    return runtime.upgrade(payload, context);
  }

  if (isPatchGroup(change)) {
    return applyUpgradeChanges(payload, change.payload.changes, context);
  }

  return applyDefaultChange(payload, change, "upgrade");
}

async function applyDowngradeChange(
  payload: unknown,
  change: RuntimeVersionChange,
  context: unknown
): Promise<unknown> {
  const runtime = change.payload;

  if (typeof runtime.downgrade === "function") {
    return runtime.downgrade(payload, context);
  }

  if (isPatchGroup(change)) {
    return applyDowngradeChanges(payload, change.payload.changes, context);
  }

  return applyDefaultChange(payload, change, "downgrade");
}

function applyDefaultChange(
  payload: unknown,
  change: RuntimeVersionChange,
  direction: "upgrade" | "downgrade"
): unknown {
  const payloadDefinition = change.payload;

  switch (change.type) {
    case "remove":
      return direction === "upgrade"
        ? removePath(payload, payloadDefinition.payloadPath)
        : cloneJsonLike(payload);
    case "add":
      return direction === "downgrade"
        ? removeFieldAtPath(
            payload,
            payloadDefinition.payloadPath,
            payloadDefinition.field ?? ""
          )
        : cloneJsonLike(payload);
    case "rename":
      return direction === "upgrade"
        ? renameFieldAtPath(
            payload,
            payloadDefinition.payloadPath,
            payloadDefinition.from ?? "",
            payloadDefinition.to ?? ""
          )
        : renameFieldAtPath(
            payload,
            payloadDefinition.payloadPath,
            payloadDefinition.to ?? "",
            payloadDefinition.from ?? ""
          );
    case "patch":
      return applyDefaultPatchChange(payload, payloadDefinition, direction);
    default:
      return cloneJsonLike(payload);
  }
}

function applyDefaultPatchChange(
  payload: unknown,
  patchPayload: RuntimeVersionChange["payload"],
  direction: "upgrade" | "downgrade"
): unknown {
  if (patchPayload.action?.type !== "remove" || direction !== "upgrade") {
    return cloneJsonLike(payload);
  }

  if (patchPayload.action.field) {
    return removeFieldAtPath(
      payload,
      patchPayload.payloadPath,
      patchPayload.action.field
    );
  }

  if (patchPayload.selector?.type === "field" && patchPayload.selector.field) {
    return removeFieldAtPath(
      payload,
      patchPayload.payloadPath,
      patchPayload.selector.field
    );
  }

  return removePath(payload, patchPayload.payloadPath);
}

function removePath(payload: unknown, payloadPath: string): unknown {
  const pathSegments = splitPath(payloadPath);
  const fieldName = pathSegments.at(-1);

  if (!fieldName) {
    return undefined;
  }

  return removeFieldAtPath(
    payload,
    pathSegments.slice(0, -1).join("."),
    fieldName
  );
}

function removeFieldAtPath(
  payload: unknown,
  payloadPath: string,
  fieldName: string
): unknown {
  const result = cloneJsonLike(payload);

  forEachObjectAtPath(result, payloadPath, (container) => {
    delete container[fieldName];
  });

  return result;
}

function renameFieldAtPath(
  payload: unknown,
  payloadPath: string,
  from: string,
  to: string
): unknown {
  const result = cloneJsonLike(payload);

  forEachObjectAtPath(result, payloadPath, (container) => {
    if (!Object.prototype.hasOwnProperty.call(container, from)) {
      return;
    }

    renameField(container, from, to);
  });

  return result;
}

export const deleteAt =
  (payloadPath: string): RuntimeTransform =>
  (payload) =>
    removePath(payload, payloadPath);

export const renameAt =
  (payloadPath: string, fields: Record<string, string>): RuntimeTransform =>
  (payload) =>
    mapObjectsAtPath(payload, payloadPath, (container) => {
      for (const [from, to] of Object.entries(fields)) {
        renameField(container, from, to);
      }
    });

export const renameNestedAt =
  (
    payloadPath: string,
    nestedFields: string[],
    fields: Record<string, string>
  ): RuntimeTransform =>
  (payload) =>
    mapObjectsAtPath(payload, payloadPath, (container) => {
      for (const nestedField of nestedFields) {
        const nested = getRecord(container, nestedField);

        if (!nested) {
          continue;
        }

        for (const [from, to] of Object.entries(fields)) {
          renameField(nested, from, to);
        }
      }
    });

export function fromSingleToArray(
  singleFieldName: string,
  arrayFieldName: string
): RuntimeTransform;
export function fromSingleToArray(
  payload: unknown,
  singleFieldName: string,
  arrayFieldName: string
): unknown;
export function fromSingleToArray(
  payloadOrSingleFieldName: unknown,
  singleFieldNameOrArrayFieldName: string,
  arrayFieldName?: string
): RuntimeTransform | unknown {
  if (
    typeof payloadOrSingleFieldName === "string" &&
    arrayFieldName === undefined
  ) {
    return (payload: unknown) =>
      moveSingleValueToArrayField(
        payload,
        payloadOrSingleFieldName,
        singleFieldNameOrArrayFieldName
      );
  }

  if (!arrayFieldName) {
    throw new Error("arrayFieldName is required.");
  }

  return moveSingleValueToArrayField(
    payloadOrSingleFieldName,
    singleFieldNameOrArrayFieldName,
    arrayFieldName
  );
}

export const restore =
  (...payloadPaths: string[]): RuntimeTransform =>
  (payload, context) =>
    restoreLegacyFields(payload, context, payloadPaths);

export function mapObjectsAtPath(
  payload: unknown,
  payloadPath: string,
  callback: (container: JsonRecord) => void
): unknown {
  const result = cloneJsonLike(payload);

  visitPath(result, splitPath(payloadPath), callback);

  return result;
}

export function renameField(
  container: JsonRecord,
  from: string,
  to: string
): void {
  if (!Object.prototype.hasOwnProperty.call(container, from)) {
    return;
  }

  container[to] = container[from];
  delete container[from];
}

export function getRecord(
  container: JsonRecord,
  fieldName: string
): JsonRecord | null {
  const value = container[fieldName];

  return isRecord(value) ? value : null;
}

export function restoreLegacyFields(
  payload: unknown,
  context: unknown,
  payloadPaths: string[]
): unknown {
  const result = cloneJsonLike(payload);

  for (const payloadPath of payloadPaths) {
    const [collectionPath, ...fieldSegments] = splitPath(payloadPath);

    if (!collectionPath || fieldSegments.length === 0) {
      continue;
    }

    const legacyRecords = getLegacyRecords(context, collectionPath);

    if (!legacyRecords) {
      continue;
    }

    visitPath(result, [collectionPath], (targetRecord) => {
      const legacyRecord = findLegacyRecord(targetRecord, legacyRecords);

      if (!legacyRecord) {
        return;
      }

      copyPathValue(legacyRecord, targetRecord, fieldSegments);
    });
  }

  return result;
}

function moveSingleValueToArrayField(
  payload: unknown,
  singleFieldName: string,
  arrayFieldName: string
): unknown {
  return mapObjectsAtPath(payload, "", (container) => {
    const singleValue = container[singleFieldName];
    const arrayValue = container[arrayFieldName];

    if (
      singleValue != null &&
      (!Array.isArray(arrayValue) || arrayValue.length === 0)
    ) {
      container[arrayFieldName] = [singleValue];
    }

    delete container[singleFieldName];
  });
}

function forEachObjectAtPath(
  payload: unknown,
  payloadPath: string,
  callback: (container: JsonRecord) => void
): void {
  visitPath(payload, splitPath(payloadPath), callback);
}

function visitPath(
  value: unknown,
  segments: string[],
  callback: (container: JsonRecord) => void
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      visitPath(item, segments, callback);
    }

    return;
  }

  if (!isRecord(value)) {
    return;
  }

  if (segments.length === 0) {
    callback(value);
    return;
  }

  const [segment, ...remainingSegments] = segments;
  visitPath(value[segment], remainingSegments, callback);
}

function splitPath(payloadPath: string): string[] {
  return payloadPath ? payloadPath.split(".") : [];
}

function copyPathValue(
  source: unknown,
  target: unknown,
  segments: string[]
): void {
  if (segments.length === 0) {
    return;
  }

  if (Array.isArray(source) && Array.isArray(target)) {
    source.forEach((sourceItem, index) => {
      copyPathValue(sourceItem, target[index], segments);
    });

    return;
  }

  if (!isRecord(source) || !isRecord(target)) {
    return;
  }

  const [segment, ...remainingSegments] = segments;

  if (remainingSegments.length === 0) {
    if (source[segment] !== undefined && target[segment] === undefined) {
      target[segment] = cloneJsonLike(source[segment]);
    }

    return;
  }

  copyPathValue(source[segment], target[segment], remainingSegments);
}

function getLegacyRecords(
  context: unknown,
  collectionPath: string
): JsonRecord | undefined {
  if (!isRecord(context)) {
    return undefined;
  }

  const contextKey = `legacy${capitalize(collectionPath)}ById`;
  const legacyRecords = context[contextKey];

  return isRecord(legacyRecords) ? legacyRecords : undefined;
}

function findLegacyRecord(
  targetRecord: JsonRecord,
  legacyRecords: JsonRecord
): JsonRecord | undefined {
  for (const key of [targetRecord.lieu_id, targetRecord._id, targetRecord.id]) {
    const stringKey = getRecordId(key);
    if (stringKey !== undefined && isRecord(legacyRecords[stringKey])) {
      return legacyRecords[stringKey] as JsonRecord;
    }
  }

  return undefined;
}

function getRecordId(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "object" && "toHexString" in value) {
    const toHexString = value.toHexString;
    if (typeof toHexString === "function") {
      return toHexString.call(value);
    }
  }

  return typeof value === "object"
    ? JSON.stringify(value) ?? ""
    : value.toString();
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cloneJsonLike<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneJsonLike(item)) as T;
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, childValue]) => [
      key,
      cloneJsonLike(childValue),
    ])
  ) as T;
}

function isPatchGroup(
  change: RuntimeVersionChange
): change is RuntimeVersionChange & {
  payload: { changes: RuntimeVersionChange[] };
} {
  return Array.isArray(change.payload.changes);
}

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
