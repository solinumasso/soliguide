import type { z } from "zod";

import {
  SchemaFieldAtPath,
  SchemaObjectPath,
  SchemaPath,
} from "./schema-path";

declare const schemaExpressionBrand: unique symbol;

export type SchemaExpression<TSchema extends z.ZodTypeAny = z.ZodTypeAny> =
  TSchema & {
    readonly [schemaExpressionBrand]: true;
  };

export type ChangeType =
  | "add"
  | "remove"
  | "rename"
  | "replaceSchema"
  | "merge"
  | "split"
  | "custom";

export interface AddChangePayload<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> {
  payloadPath: TPath;
  field: string;
  schema: SchemaExpression;
}

export interface RemoveChangePayload<TSchema> {
  payloadPath: SchemaPath<TSchema>;
}

export type RenameChangePayload<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> = {
  payloadPath: TPath;
  from: SchemaFieldAtPath<TSchema, TPath>;
  to: string;
};

export interface ReplaceSchemaChangePayload<TSchema> {
  payloadPath: SchemaPath<TSchema>;
  schema: SchemaExpression;
}

export type MergeChangePayload<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> = {
  payloadPath: TPath;
  from: SchemaFieldAtPath<TSchema, TPath>[];
  to: string;
  schema: SchemaExpression;
};

export type SplitChangePayload<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> = {
  payloadPath: TPath;
  from: SchemaFieldAtPath<TSchema, TPath>;
  to: Record<string, SchemaExpression>;
};

export type CustomSelector<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> =
  | {
      type: "self";
    }
  | {
      type: "field";
      field: SchemaFieldAtPath<TSchema, TPath>;
    };

export type CustomAction<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> =
  | {
      type: "replace";
      schema: SchemaExpression;
    }
  | {
      type: "insert";
      field: string;
      schema: SchemaExpression;
    }
  | {
      type: "remove";
      field?: SchemaFieldAtPath<TSchema, TPath>;
    };

export type CustomChangePayload<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
> = {
  payloadPath: TPath;
  selector?: CustomSelector<TSchema, TPath>;
  action: CustomAction<TSchema, TPath>;
};

type RenameAuthoringPayloadByPath<
  TSchema,
  TPath extends SchemaObjectPath<TSchema>,
> = TPath extends TPath ? RenameChangePayload<TSchema, TPath> : never;

type RenameAuthoringPayload<TSchema> = RenameAuthoringPayloadByPath<
  TSchema,
  SchemaObjectPath<TSchema>
>;

type MergeAuthoringPayloadByPath<
  TSchema,
  TPath extends SchemaObjectPath<TSchema>,
> = TPath extends TPath ? MergeChangePayload<TSchema, TPath> : never;

type MergeAuthoringPayload<TSchema> = MergeAuthoringPayloadByPath<
  TSchema,
  SchemaObjectPath<TSchema>
>;

type SplitAuthoringPayloadByPath<
  TSchema,
  TPath extends SchemaObjectPath<TSchema>,
> = TPath extends TPath ? SplitChangePayload<TSchema, TPath> : never;

type SplitAuthoringPayload<TSchema> = SplitAuthoringPayloadByPath<
  TSchema,
  SchemaObjectPath<TSchema>
>;

type CustomAuthoringPayloadByPath<
  TSchema,
  TPath extends SchemaObjectPath<TSchema>,
> = TPath extends TPath ? CustomChangePayload<TSchema, TPath> : never;

type CustomAuthoringPayload<TSchema> = CustomAuthoringPayloadByPath<
  TSchema,
  SchemaObjectPath<TSchema>
>;

export type ChangePayloadByType<TSchema> = {
  add: AddChangePayload<TSchema>;
  remove: RemoveChangePayload<TSchema>;
  rename: RenameChangePayload<TSchema>;
  replaceSchema: ReplaceSchemaChangePayload<TSchema>;
  merge: MergeChangePayload<TSchema>;
  split: SplitChangePayload<TSchema>;
  custom: CustomChangePayload<TSchema>;
};

export type VersionChange<TSchema, TType extends ChangeType = ChangeType> = {
  type: TType;
  payload: ChangePayloadByType<TSchema>[TType];
};

export type AnyVersionChange<TSchema = unknown> = VersionChange<
  TSchema,
  ChangeType
>;

type ChangeWithPaths = {
  changeName?: string;
  type: ChangeType;
  payload: any;
};

const PATH_SEGMENT_REGEX = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const VERSION_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function assertVersionToken(version: string, label: string): void {
  if (!VERSION_REGEX.test(version)) {
    throw new Error(
      `Invalid ${label} "${version}". Expected format YYYY-MM-DD.`
    );
  }
}

export function assertPayloadPath(
  payloadPath: string,
  contextLabel: string
): void {
  const segments = payloadPath.split(".");
  if (segments.length === 0) {
    throw new Error(`${contextLabel} payloadPath cannot be empty`);
  }

  for (const segment of segments) {
    if (!segment || !PATH_SEGMENT_REGEX.test(segment)) {
      throw new Error(
        `${contextLabel} has invalid payloadPath segment "${segment}" in path "${payloadPath}"`
      );
    }
  }
}

export function assertFieldToken(
  fieldName: string,
  contextLabel: string
): void {
  if (!PATH_SEGMENT_REGEX.test(fieldName)) {
    throw new Error(`Invalid field token "${fieldName}" for ${contextLabel}`);
  }
}

export function assertUniqueResourceNames(
  resources: { resourceName: string }[],
  sourceLabel: string
): void {
  const seenResourceNames = new Set<string>();

  for (const resource of resources) {
    if (seenResourceNames.has(resource.resourceName)) {
      throw new Error(
        `Duplicate resourceName ${resource.resourceName} in ${sourceLabel}`
      );
    }

    seenResourceNames.add(resource.resourceName);
  }
}

export function assertChangesDoNotConflict(
  resourceName: string,
  changes: ChangeWithPaths[]
): void {
  const touchedPaths = new Map<string, string>();

  for (const [index, change] of changes.entries()) {
    const changeName =
      change.changeName ?? `${resourceName}:${change.type}#${index + 1}`;

    for (const pathKey of getTouchedPaths(change)) {
      const previousChange = touchedPaths.get(pathKey);
      if (previousChange) {
        throw new Error(
          `Conflicting ordered edits for resource ${resourceName} on path ${pathKey}: ${previousChange} and ${changeName}`
        );
      }

      touchedPaths.set(pathKey, changeName);
    }
  }
}

function getTouchedPaths(change: ChangeWithPaths): string[] {
  switch (change.type) {
    case "add":
      return [`${change.payload.payloadPath}.${change.payload.field}`];
    case "remove":
      return [change.payload.payloadPath];
    case "rename":
      return [
        `${change.payload.payloadPath}.${change.payload.from}`,
        `${change.payload.payloadPath}.${change.payload.to}`,
      ];
    case "replaceSchema":
      return [change.payload.payloadPath];
    case "merge":
      return [
        ...(change.payload.from as string[]).map(
          (fieldName) => `${change.payload.payloadPath}.${fieldName}`
        ),
        `${change.payload.payloadPath}.${change.payload.to}`,
      ];
    case "split":
      return [
        `${change.payload.payloadPath}.${change.payload.from}`,
        ...Object.keys(change.payload.to as Record<string, unknown>).map(
          (fieldName) => `${change.payload.payloadPath}.${fieldName}`
        ),
      ];
    case "custom": {
      const action = change.payload.action;

      if (action?.type === "insert") {
        return [`${change.payload.payloadPath}.${action.field}`];
      }

      if (action?.type === "remove" && action.field) {
        return [`${change.payload.payloadPath}.${action.field}`];
      }

      if (change.payload.selector?.type === "field") {
        return [
          `${change.payload.payloadPath}.${change.payload.selector.field}`,
        ];
      }

      return [change.payload.payloadPath];
    }
    default:
      return [];
  }
}

function assertCustomSelector(
  selector: CustomSelector<any, any> | undefined,
  contextLabel: string
): void {
  if (!selector) {
    return;
  }

  if (selector.type === "field") {
    assertFieldToken(selector.field, `${contextLabel} selector.field`);
  }
}

function assertCustomAction(
  action: CustomAction<any, any>,
  contextLabel: string
): void {
  if (action.type === "insert") {
    assertFieldToken(action.field, `${contextLabel} action.field`);
    return;
  }

  if (action.type === "remove" && action.field) {
    assertFieldToken(action.field, `${contextLabel} action.field`);
  }
}

export function schema<TSchema extends z.ZodTypeAny>(
  value: TSchema
): SchemaExpression<TSchema> {
  return value as SchemaExpression<TSchema>;
}

export function add<
  TSchema,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>,
>(
  payload: AddChangePayload<TSchema, TPath>
): VersionChange<TSchema, "add"> {
  assertPayloadPath(payload.payloadPath, "add");
  assertFieldToken(payload.field, "add field");

  return {
    payload: payload as unknown as AddChangePayload<TSchema>,
    type: "add",
  };
}

export function remove<TSchema>(
  payload: RemoveChangePayload<TSchema>
): VersionChange<TSchema, "remove"> {
  assertPayloadPath(payload.payloadPath, "remove");

  return {
    payload,
    type: "remove",
  };
}

export function rename<TSchema>(
  payload: RenameAuthoringPayload<TSchema>
): VersionChange<TSchema, "rename"> {
  const normalizedPayload = payload as unknown as RenameChangePayload<TSchema>;
  assertPayloadPath(normalizedPayload.payloadPath, "rename");
  assertFieldToken(normalizedPayload.from, "rename from");
  assertFieldToken(normalizedPayload.to, "rename to");

  return {
    payload: normalizedPayload,
    type: "rename",
  };
}

export function replaceSchema<TSchema>(
  payload: ReplaceSchemaChangePayload<TSchema>
): VersionChange<TSchema, "replaceSchema"> {
  assertPayloadPath(payload.payloadPath, "replaceSchema");

  return {
    payload,
    type: "replaceSchema",
  };
}

export function merge<TSchema>(
  payload: MergeAuthoringPayload<TSchema>
): VersionChange<TSchema, "merge"> {
  const normalizedPayload = payload as unknown as MergeChangePayload<TSchema>;
  assertPayloadPath(normalizedPayload.payloadPath, "merge");
  if (normalizedPayload.from.length === 0) {
    throw new Error("merge requires non-empty from array");
  }

  for (const fieldName of normalizedPayload.from) {
    assertFieldToken(fieldName, "merge from[]");
  }
  assertFieldToken(normalizedPayload.to, "merge to");

  return {
    payload: normalizedPayload,
    type: "merge",
  };
}

export function split<TSchema>(
  payload: SplitAuthoringPayload<TSchema>
): VersionChange<TSchema, "split"> {
  const normalizedPayload = payload as unknown as SplitChangePayload<TSchema>;
  assertPayloadPath(normalizedPayload.payloadPath, "split");
  assertFieldToken(normalizedPayload.from, "split from");

  const targetFields = Object.keys(normalizedPayload.to);
  if (targetFields.length === 0) {
    throw new Error("split to object cannot be empty");
  }

  for (const fieldName of targetFields) {
    assertFieldToken(fieldName, "split to key");
  }

  return {
    payload: normalizedPayload,
    type: "split",
  };
}

export function custom<TSchema>(
  payload: CustomAuthoringPayload<TSchema>
): VersionChange<TSchema, "custom"> {
  const normalizedPayload = payload as unknown as CustomChangePayload<TSchema>;
  assertPayloadPath(normalizedPayload.payloadPath, "custom");
  assertCustomSelector(normalizedPayload.selector, "custom");
  assertCustomAction(normalizedPayload.action, "custom");

  return {
    payload: normalizedPayload,
    type: "custom",
  };
}
