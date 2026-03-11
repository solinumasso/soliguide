import type {
  CompiledOpenApiPatch,
  OpenApiPropertySchema,
} from '../../versioning/versioning.types';
import { parseObjectPath } from '../../versioning/object-path.utils';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeRequired(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function setRequired(node: Record<string, unknown>, required: string[]): void {
  if (required.length === 0) {
    delete node.required;
    return;
  }

  node.required = required;
}

function applyRequiredDirective(
  objectNode: Record<string, unknown>,
  property: string,
  requiredDirective: boolean | undefined,
): void {
  if (requiredDirective === undefined) {
    return;
  }

  const required = normalizeRequired(objectNode.required);

  if (requiredDirective) {
    if (!required.includes(property)) {
      required.push(property);
    }
    setRequired(objectNode, required);
    return;
  }

  setRequired(
    objectNode,
    required.filter((entry) => entry !== property),
  );
}

function resolveObjectNode(
  root: OpenApiPropertySchema,
  objectPath: string,
): Record<string, unknown> {
  const tokens = parseObjectPath(objectPath);

  let cursor: unknown = root;
  for (const token of tokens) {
    if (!isRecord(cursor) || !(token in cursor)) {
      throw new Error(
        `Invalid objectPath "${objectPath}". Missing segment "${token}".`,
      );
    }

    cursor = cursor[token];
  }

  if (!isRecord(cursor)) {
    throw new Error(
      `Invalid objectPath "${objectPath}". Target must resolve to an object schema.`,
    );
  }

  return cursor;
}

function ensureProperties(
  objectNode: Record<string, unknown>,
  objectPath: string,
): Record<string, OpenApiPropertySchema> {
  if (!('properties' in objectNode)) {
    objectNode.properties = {};
  }

  const properties = objectNode.properties;

  if (!isRecord(properties)) {
    throw new Error(
      `Invalid OpenAPI schema shape at objectPath "${objectPath}": properties must be an object.`,
    );
  }

  return properties as Record<string, OpenApiPropertySchema>;
}

export function cloneOpenApiSchema<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function applyOpenApiPatch(
  rootSchema: OpenApiPropertySchema,
  patch: CompiledOpenApiPatch,
): void {
  const objectNode = resolveObjectNode(rootSchema, patch.objectPath);
  const properties = ensureProperties(objectNode, patch.objectPath);

  for (const removedProperty of patch.remove ?? []) {
    delete properties[removedProperty];
    applyRequiredDirective(objectNode, removedProperty, false);
  }

  for (const [field, descriptor] of Object.entries(patch.set ?? {})) {
    properties[field] = cloneOpenApiSchema(descriptor.schema);
    applyRequiredDirective(objectNode, field, descriptor.required);
  }
}
