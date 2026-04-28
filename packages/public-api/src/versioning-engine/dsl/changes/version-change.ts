import type { z } from "zod";

import {
  SchemaFieldAtPath,
  SchemaObjectPath,
  SchemaPath,
} from "../schema-path";
import { ChangeRuntime, ResourceKind } from "./runtime";

export type ChangeType =
  | "add"
  | "remove"
  | "rename"
  | "replaceSchema"
  | "patch";

export type ChangeImpact = "breaking" | "nonBreaking";

export type VersionChange<TSchema, TType extends ChangeType = ChangeType> = {
  type: TType;
  payload: ChangePayloadByType<TSchema>[TType];
};

type ChangePayloadByType<TSchema> = {
  add: AddChangePayload<TSchema>;
  remove: RemoveChangePayload<TSchema>;
  rename: RenameChangePayload<TSchema>;
  replaceSchema: ReplaceSchemaChangePayload<TSchema>;
  patch: PatchChangePayload<TSchema>;
};

export function add<TSchema, TDirection extends ResourceKind = ResourceKind>(
  payload: AddChangePayload<TSchema, TDirection>
): VersionChange<TSchema, "add"> {
  assertPayloadPath({ payloadPath: payload.payloadPath, contextLabel: "add" });
  assertFieldToken({ fieldName: payload.field, contextLabel: "add field" });

  return {
    payload: payload as unknown as AddChangePayload<TSchema>,
    type: "add",
  };
}

export type AddChangePayload<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = ChangeMetadata &
  ChangeRuntime<TDirection> & {
    payloadPath: SchemaObjectPath<TSchema>;
    field: string;
    schema: SchemaExpression;
  };

export function remove<TSchema, TDirection extends ResourceKind = ResourceKind>(
  payload: RemoveChangePayload<TSchema, TDirection>
): VersionChange<TSchema, "remove"> {
  assertPayloadPath({
    payloadPath: payload.payloadPath,
    contextLabel: "remove",
  });

  return {
    payload,
    type: "remove",
  };
}

export type RemoveChangePayload<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = ChangeMetadata &
  ChangeRuntime<TDirection> & {
    payloadPath: SchemaPath<TSchema>;
  };

export function rename<TSchema, TDirection extends ResourceKind = ResourceKind>(
  payload: RenameChangePayload<TSchema, TDirection>
): VersionChange<TSchema, "rename"> {
  const normalizedPayload = payload as unknown as RenameChangePayload<TSchema>;
  assertPayloadPath({
    payloadPath: normalizedPayload.payloadPath,
    contextLabel: "rename",
  });
  assertFieldToken({
    fieldName: normalizedPayload.from,
    contextLabel: "rename from",
  });
  assertFieldToken({
    fieldName: normalizedPayload.to,
    contextLabel: "rename to",
  });

  return {
    payload: normalizedPayload,
    type: "rename",
  };
}

export type RenameChangePayload<
  TSchema,
  TDirection extends ResourceKind = ResourceKind,
  TPath extends SchemaObjectPath<TSchema> = SchemaObjectPath<TSchema>
> = {
  [Path in TPath]: RenameChangePayloadAtPath<TSchema, TDirection, Path>;
}[TPath];

type RenameChangePayloadAtPath<
  TSchema,
  TDirection extends ResourceKind,
  TPath extends SchemaObjectPath<TSchema>
> = {
  payloadPath: TPath;
  from: SchemaFieldAtPath<TSchema, TPath>;
  to: string;
} & ChangeMetadata &
  ChangeRuntime<TDirection>;

export function replaceSchema<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
>(
  payload: ReplaceSchemaChangePayload<TSchema, TDirection>
): VersionChange<TSchema, "replaceSchema"> {
  assertPayloadPath({
    payloadPath: payload.payloadPath,
    contextLabel: "replaceSchema",
  });

  return {
    payload,
    type: "replaceSchema",
  };
}

/**
 * Simple wrapper around a Zod schema to facilitate identification by AST
 */
export function schema<TSchema extends z.ZodTypeAny>(
  value: TSchema
): SchemaExpression<TSchema> {
  return value as SchemaExpression<TSchema>;
}

export type SchemaExpression<TSchema extends z.ZodTypeAny = z.ZodTypeAny> =
  TSchema & {
    readonly [schemaExpressionBrand]: true;
  };

export declare const schemaExpressionBrand: unique symbol;

export type ReplaceSchemaChangePayload<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = ChangeMetadata &
  ChangeRuntime<TDirection> & {
    payloadPath: SchemaPath<TSchema>;
    schema: SchemaExpression;
  };

export function patch<TSchema, TDirection extends ResourceKind = ResourceKind>(
  payload: PatchChangePayload<TSchema, TDirection>
): VersionChange<TSchema, "patch"> {
  assertPayloadPath({
    payloadPath: payload.payloadPath,
    contextLabel: "patch",
  });

  if (isPatchGroupPayload(payload)) {
    if (
      (payload.changes as AnyVersionChange<TSchema>[]).some(
        (change) => change.type === "patch"
      )
    ) {
      throw new Error(
        "patch group changes cannot contain nested patch changes"
      );
    }

    return {
      payload,
      type: "patch",
    };
  }

  throw new Error("Invalid patch group.");
}

export type PatchChangePayload<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = ChangeMetadata &
  ChangeRuntime<TDirection> & {
    payloadPath: SchemaPath<TSchema>;
    changes: PrimitiveVersionChange<TSchema>[];
  };

type ChangeMetadata = {
  title?: string;
  description?: string;
  impact?: ChangeImpact;
};

type PrimitiveVersionChange<TSchema> = {
  [TType in PrimitiveChangeType]: VersionChange<TSchema, TType>;
}[PrimitiveChangeType];

type PrimitiveChangeType = Exclude<ChangeType, "patch">;

export type AnyVersionChange<TSchema = unknown> = {
  [TType in ChangeType]: VersionChange<TSchema, TType>;
}[ChangeType];

export function isPatchGroupPayload(
  payload: any
): payload is PatchChangePayload<any> {
  return Array.isArray(payload?.changes);
}

function assertPayloadPath({
  payloadPath,
  contextLabel,
}: {
  payloadPath: string;
  contextLabel: string;
}): void {
  if (payloadPath === "") {
    return;
  }

  const segments = payloadPath.split(".");

  for (const segment of segments) {
    if (!segment || !PATH_SEGMENT_REGEX.test(segment)) {
      throw new Error(
        `${contextLabel} has invalid payloadPath segment "${segment}" in path "${payloadPath}"`
      );
    }
  }
}

function assertFieldToken({
  fieldName,
  contextLabel,
}: {
  fieldName: string;
  contextLabel: string;
}): void {
  if (!PATH_SEGMENT_REGEX.test(fieldName)) {
    throw new Error(`Invalid field token "${fieldName}" for ${contextLabel}`);
  }
}

const PATH_SEGMENT_REGEX = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
