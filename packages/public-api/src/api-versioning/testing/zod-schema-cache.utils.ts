import { z } from 'zod';
import { parseObjectPath } from '../versioning/object-path.utils';
import type { CompiledSchemaPatch } from '../versioning/versioning.types';

type ZodWrapper = 'optional' | 'nullable';

function unwrapSchema(schema: z.ZodTypeAny): {
  base: z.ZodTypeAny;
  wrappers: ZodWrapper[];
} {
  const wrappers: ZodWrapper[] = [];
  let base = schema;

  while (true) {
    if (base instanceof z.ZodOptional) {
      wrappers.push('optional');
      base = base.unwrap() as z.ZodTypeAny;
      continue;
    }

    if (base instanceof z.ZodNullable) {
      wrappers.push('nullable');
      base = base.unwrap() as z.ZodTypeAny;
      continue;
    }

    break;
  }

  return {
    base,
    wrappers,
  };
}

function rewrapSchema(
  schema: z.ZodTypeAny,
  wrappers: readonly ZodWrapper[],
): z.ZodTypeAny {
  return wrappers.reduceRight<z.ZodTypeAny>((accumulator, wrapper) => {
    if (wrapper === 'optional') {
      return accumulator.optional();
    }

    if (wrapper === 'nullable') {
      return accumulator.nullable();
    }

    return accumulator;
  }, schema);
}

function isZodObject(
  schema: z.ZodTypeAny,
): schema is z.ZodObject<z.ZodRawShape> {
  return schema instanceof z.ZodObject;
}

function isZodArray(schema: z.ZodTypeAny): schema is z.ZodArray<z.ZodTypeAny> {
  return schema instanceof z.ZodArray;
}

function applyObjectPatch(
  schema: z.ZodObject<z.ZodRawShape>,
  patch: CompiledSchemaPatch,
): z.ZodObject<z.ZodRawShape> {
  let nextSchema = schema;

  if ((patch.remove ?? []).length > 0) {
    const omitMask = (patch.remove ?? []).reduce<Record<string, true>>(
      (accumulator, field) => {
        accumulator[field] = true;
        return accumulator;
      },
      {},
    );

    nextSchema = nextSchema.omit(omitMask);
  }

  if (patch.set && Object.keys(patch.set).length > 0) {
    const extension: Record<string, z.ZodTypeAny> = {};
    for (const [field, spec] of Object.entries(patch.set)) {
      extension[field] = spec.zod;
    }

    nextSchema = nextSchema.extend(extension as z.ZodRawShape);
  }

  return nextSchema;
}

function hasObjectPatch(patch: CompiledSchemaPatch): boolean {
  return (patch.remove ?? []).length > 0 || Boolean(patch.set);
}

function applyPatchAtTarget(
  schema: z.ZodTypeAny,
  patch: CompiledSchemaPatch,
): z.ZodTypeAny {
  let nextSchema = patch.replace?.zod ?? schema;

  if (!hasObjectPatch(patch)) {
    return nextSchema;
  }

  if (!isZodObject(nextSchema)) {
    throw new Error(
      `Invalid payloadPath "${patch.payloadPath}". Target must resolve to a ZodObject.`,
    );
  }

  nextSchema = applyObjectPatch(nextSchema, patch);
  return nextSchema;
}

function updateSchemaAtPath(
  schema: z.ZodTypeAny,
  tokens: readonly string[],
  patch: CompiledSchemaPatch,
): z.ZodTypeAny {
  const { base, wrappers } = unwrapSchema(schema);

  let updatedBase: z.ZodTypeAny;

  if (tokens.length === 0) {
    if (patch.replace) {
      return applyPatchAtTarget(patch.replace.zod, patch);
    }

    if (!isZodObject(base)) {
      throw new Error(
        `Invalid payloadPath "${patch.payloadPath}". Target must resolve to a ZodObject.`,
      );
    }

    updatedBase = applyPatchAtTarget(base, patch);
    return rewrapSchema(updatedBase, wrappers);
  }

  const [head, ...rest] = tokens;

  if (head === '*') {
    if (!isZodArray(base)) {
      throw new Error(
        `Invalid payloadPath "${patch.payloadPath}". Wildcard can only target ZodArray nodes.`,
      );
    }

    const updatedElement = updateSchemaAtPath(base.element, rest, patch);
    updatedBase = base.clone({
      ...base.def,
      element: updatedElement,
    });
    return rewrapSchema(updatedBase, wrappers);
  }

  if (!isZodObject(base)) {
    throw new Error(
      `Invalid payloadPath "${patch.payloadPath}". Segment "${head}" requires a ZodObject node.`,
    );
  }

  const shape = base.shape as Record<string, z.ZodTypeAny>;

  if (!(head in shape)) {
    throw new Error(
      `Invalid payloadPath "${patch.payloadPath}". Missing segment "${head}" in Zod schema.`,
    );
  }

  const updatedChild = updateSchemaAtPath(shape[head], rest, patch);
  updatedBase = base.extend({ [head]: updatedChild } as z.ZodRawShape);

  return rewrapSchema(updatedBase, wrappers);
}

export function applySchemaPatch(
  rootSchema: z.ZodTypeAny,
  patch: CompiledSchemaPatch,
): z.ZodTypeAny {
  const tokens = parseObjectPath(patch.payloadPath, { allowWildcard: true });
  return updateSchemaAtPath(rootSchema, tokens, patch);
}
