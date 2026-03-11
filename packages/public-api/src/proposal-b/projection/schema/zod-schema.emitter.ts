import { z } from 'zod';

const SAFE_INT_MIN = Number.MIN_SAFE_INTEGER;
const SAFE_INT_MAX = Number.MAX_SAFE_INTEGER;

function isIdentifier(value: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
}

function formatKey(value: string): string {
  return isIdentifier(value) ? value : JSON.stringify(value);
}

function indent(value: string, depth: number): string {
  return `${'  '.repeat(depth)}${value}`;
}

function hasCoerceFlag(schema: z.ZodTypeAny): boolean {
  const schemaWithDef = schema as z.ZodTypeAny & {
    _def?: { coerce?: boolean };
    def?: { coerce?: boolean };
  };

  return (
    schemaWithDef._def?.coerce === true || schemaWithDef.def?.coerce === true
  );
}

function emitString(schema: z.ZodString): string {
  let expression = hasCoerceFlag(schema) ? 'z.coerce.string()' : 'z.string()';

  if (schema.minLength !== null) {
    expression = `${expression}.min(${schema.minLength})`;
  }

  if (schema.maxLength !== null) {
    expression = `${expression}.max(${schema.maxLength})`;
  }

  const format = schema.format;
  if (format === 'email') {
    expression = `${expression}.email()`;
  }

  if (format === 'url') {
    expression = `${expression}.url()`;
  }

  if (format === 'date') {
    expression = `${expression}.date()`;
  }

  if (format === 'datetime') {
    expression = `${expression}.datetime()`;
  }

  return expression;
}

function emitNumber(schema: z.ZodNumber): string {
  let expression = hasCoerceFlag(schema) ? 'z.coerce.number()' : 'z.number()';

  if (schema.isInt) {
    expression = `${expression}.int()`;
  }

  if (schema.minValue !== -Infinity && schema.minValue !== SAFE_INT_MIN) {
    expression = `${expression}.min(${schema.minValue})`;
  }

  if (schema.maxValue !== Infinity && schema.maxValue !== SAFE_INT_MAX) {
    expression = `${expression}.max(${schema.maxValue})`;
  }

  return expression;
}

function emitBoolean(schema: z.ZodBoolean): string {
  return hasCoerceFlag(schema) ? 'z.coerce.boolean()' : 'z.boolean()';
}

function emitObject(schema: z.ZodObject<z.ZodRawShape>, depth: number): string {
  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  const entries = Object.entries(shape);

  if (entries.length === 0) {
    return 'z.object({})';
  }

  const body = entries
    .map(([key, fieldSchema]) => {
      return indent(
        `${formatKey(key)}: ${emitSchema(fieldSchema, depth + 1)},`,
        depth + 1,
      );
    })
    .join('\n');

  let expression = `z.object({\n${body}\n${indent('}', depth)})`;

  const objectWithDef = schema as z.ZodObject<z.ZodRawShape> & {
    _def?: { catchall?: z.ZodTypeAny };
  };

  if (objectWithDef._def?.catchall instanceof z.ZodNever) {
    expression = `${expression}.strict()`;
  }

  return expression;
}

function emitSchema(schema: z.ZodTypeAny, depth = 0): string {
  if (schema instanceof z.ZodOptional) {
    return `${emitSchema(schema.unwrap() as z.ZodTypeAny, depth)}.optional()`;
  }

  if (schema instanceof z.ZodNullable) {
    return `${emitSchema(schema.unwrap() as z.ZodTypeAny, depth)}.nullable()`;
  }

  if (schema instanceof z.ZodString) {
    return emitString(schema);
  }

  if (schema instanceof z.ZodNumber) {
    return emitNumber(schema);
  }

  if (schema instanceof z.ZodBoolean) {
    return emitBoolean(schema);
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema.options
      .map((option) => JSON.stringify(option))
      .join(', ');
    return `z.enum([${values}])`;
  }

  if (schema instanceof z.ZodLiteral) {
    return `z.literal(${JSON.stringify(schema.value)})`;
  }

  if (schema instanceof z.ZodArray) {
    return `z.array(${emitSchema(schema.element as z.ZodTypeAny, depth)})`;
  }

  if (schema instanceof z.ZodObject) {
    return emitObject(schema as z.ZodObject<z.ZodRawShape>, depth);
  }

  if (schema instanceof z.ZodUnion) {
    const options = schema.options
      .map((option) => emitSchema(option as z.ZodTypeAny, depth + 1))
      .join(', ');

    return `z.union([${options}])`;
  }

  return 'z.any()';
}

export function emitZodSchemaModule(
  schema: z.ZodTypeAny,
  options: {
    constName: string;
  },
): string {
  const expression = emitSchema(schema);

  return [
    "import { z } from 'zod';",
    '',
    `export const ${options.constName} = ${expression};`,
    '',
    `export type ${options.constName}Type = z.infer<typeof ${options.constName}>;`,
    '',
    `export default ${options.constName};`,
    '',
  ].join('\n');
}
