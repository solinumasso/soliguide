/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ApiPropertyOptions } from '@nestjs/swagger';
import type {
  DecoratorFreeApiPropertyOptions,
  OpenApiPropertyDescriptor,
  OpenApiPropertySchema,
} from '../../versioning/versioning.types';

function constructorToOpenApiType(
  constructorType: Function,
): { type: string; format?: string } | null {
  if (constructorType === String) {
    return { type: 'string' };
  }

  if (constructorType === Number) {
    return { type: 'number' };
  }

  if (constructorType === Boolean) {
    return { type: 'boolean' };
  }

  if (constructorType === Date) {
    return { type: 'string', format: 'date-time' };
  }

  if (constructorType === Array) {
    return { type: 'array' };
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function omitUndefined(
  input: Record<string, unknown>,
): Record<string, unknown> {
  return Object.entries(input).reduce<Record<string, unknown>>(
    (accumulator, [key, value]) => {
      if (value !== undefined) {
        accumulator[key] = value;
      }

      return accumulator;
    },
    {},
  );
}

function normalizeExplicitType(inputType: unknown): {
  type?: string;
  format?: string;
  forceArray: boolean;
} {
  if (Array.isArray(inputType)) {
    if (inputType.length !== 1 || typeof inputType[0] !== 'function') {
      throw new Error(
        'apiProperty only supports single constructor arrays (for example: [String]).',
      );
    }

    const normalized = constructorToOpenApiType(inputType[0]);
    if (!normalized) {
      throw new Error(
        `Unsupported constructor type in apiProperty array: ${inputType[0].name}. Use rawProperty(...) for advanced schemas.`,
      );
    }

    return {
      type: normalized.type,
      format: normalized.format,
      forceArray: true,
    };
  }

  if (typeof inputType === 'function') {
    const normalized = constructorToOpenApiType(inputType);
    if (!normalized) {
      throw new Error(
        `Unsupported constructor type in apiProperty: ${inputType.name}. Use rawProperty(...) for advanced schemas.`,
      );
    }

    return {
      type: normalized.type,
      format: normalized.format,
      forceArray: false,
    };
  }

  if (typeof inputType === 'string') {
    return {
      type: inputType,
      forceArray: false,
    };
  }

  return {
    forceArray: false,
  };
}

function toDescriptorSchema(
  options: DecoratorFreeApiPropertyOptions,
): OpenApiPropertySchema {
  const {
    required: _required,
    isArray,
    enumName: _enumName,
    enumSchema,
    type,
    ...rawOptions
  } = options as DecoratorFreeApiPropertyOptions & {
    isArray?: boolean;
    enumName?: string;
    enumSchema?: Record<string, unknown>;
    type?: unknown;
  };

  const baseSchema = omitUndefined(rawOptions as Record<string, unknown>);
  const normalizedType = normalizeExplicitType(type);

  if (normalizedType.type) {
    baseSchema.type = normalizedType.type;
  }

  if (normalizedType.format && !baseSchema.format) {
    baseSchema.format = normalizedType.format;
  }

  const shouldWrapAsArray = isArray === true || normalizedType.forceArray;

  const schema = shouldWrapAsArray
    ? ({
        type: 'array',
        items: baseSchema,
      } satisfies Record<string, unknown>)
    : baseSchema;

  if (enumSchema && isRecord(schema) && Array.isArray(schema.enum)) {
    Object.assign(schema, enumSchema);
  }

  return schema as OpenApiPropertySchema;
}

export function apiProperty(
  options: ApiPropertyOptions,
): OpenApiPropertyDescriptor {
  const descriptorOptions = options as DecoratorFreeApiPropertyOptions;

  return {
    schema: toDescriptorSchema(descriptorOptions),
    required: descriptorOptions.required,
  };
}

export function rawProperty(
  schema: OpenApiPropertySchema,
  options: { required?: boolean } = {},
): OpenApiPropertyDescriptor {
  return {
    schema,
    required: options.required,
  };
}
