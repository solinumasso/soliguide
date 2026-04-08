import { z } from 'zod';

const FIELD_SPEC_SCHEMA_EXPRESSION = Symbol.for(
  'api-versioning.field-spec-schema-expression',
);

export function annotateZodSchemaExpression(
  schema: z.ZodTypeAny,
  expression: string,
): z.ZodTypeAny {
  Object.defineProperty(schema, FIELD_SPEC_SCHEMA_EXPRESSION, {
    value: expression,
    enumerable: false,
    configurable: true,
    writable: false,
  });

  return schema;
}

export function readZodSchemaExpression(
  schema: unknown,
): string | undefined {
  if (typeof schema !== 'object' || schema === null) {
    return undefined;
  }

  const withMeta = schema as {
    [FIELD_SPEC_SCHEMA_EXPRESSION]?: unknown;
  };

  const value = withMeta[FIELD_SPEC_SCHEMA_EXPRESSION];
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
