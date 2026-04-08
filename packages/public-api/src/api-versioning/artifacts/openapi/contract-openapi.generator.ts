import { z } from 'zod';
import { deepClone, isRecord } from '../../utils';
import type {
  ApiVersion,
  OpenApiOperationTarget,
} from '../../versioning/versioning.types';

export class ContractOpenApiGenerator {
  buildVersionOpenApiDocument(
    input: BuildVersionOpenApiDocumentInput,
  ): Record<string, unknown> {
    const requestOpenApiSchema = zodSchemaToOpenApiSchema(input.requestSchema, {
      io: 'input',
    });
    const responseOpenApiSchema = zodSchemaToOpenApiSchema(
      input.responseSchema,
      { io: 'output' },
    );

    return this.buildOpenApiDocument(
      input.baseOpenApiDocument,
      input.version,
      input.openApiOperationTarget,
      requestOpenApiSchema,
      responseOpenApiSchema,
    );
  }

  private buildOpenApiDocument(
    baseOpenApiDocument: Record<string, unknown>,
    version: ApiVersion,
    target: OpenApiOperationTarget,
    requestSchema: Record<string, unknown>,
    responseSchema: Record<string, unknown>,
  ): Record<string, unknown> {
    const document = deepClone(baseOpenApiDocument);
    const info = this.ensureRecord(
      document.info,
      'OpenAPI document is missing info.',
    );
    info.version = version;

    const paths = this.ensureRecord(
      document.paths,
      'OpenAPI document is missing paths.',
    );
    const pathItem = this.ensureRecord(
      paths[target.path],
      `OpenAPI document is missing path "${target.path}".`,
    );

    const operation = this.ensureRecord(
      pathItem[target.method],
      `OpenAPI document is missing operation "${target.method.toUpperCase()} ${target.path}".`,
    );

    if (target.method === 'get') {
      operation.parameters = this.buildQueryParameters(requestSchema);
    } else {
      operation.requestBody = {
        content: {
          'application/json': {
            schema: deepClone(requestSchema),
          },
        },
      };
    }

    const responses = this.ensureRecord(
      operation.responses ?? {},
      'OpenAPI operation responses must be an object when defined.',
    );
    operation.responses = responses;

    const okResponse = this.ensureRecord(
      responses['200'] ?? {},
      'OpenAPI response "200" must be an object when defined.',
    );
    responses['200'] = okResponse;

    if (typeof okResponse.description !== 'string') {
      okResponse.description = 'Successful search response';
    }

    const content = this.ensureRecord(
      okResponse.content ?? {},
      'OpenAPI response content must be an object when defined.',
    );
    okResponse.content = content;

    const applicationJsonContent = this.ensureRecord(
      content['application/json'] ?? {},
      'OpenAPI response content for application/json must be an object when defined.',
    );
    content['application/json'] = applicationJsonContent;
    applicationJsonContent.schema = deepClone(responseSchema);

    return document;
  }

  private buildQueryParameters(
    requestSchema: Record<string, unknown>,
  ): Record<string, unknown>[] {
    if (requestSchema.type !== 'object') {
      throw new Error(
        'Request schema root must be a z.object(...) to generate query parameters.',
      );
    }

    const rawProperties = requestSchema.properties;

    if (rawProperties === undefined) {
      return [];
    }

    if (!isRecord(rawProperties)) {
      throw new Error(
        'Request OpenAPI schema properties must be an object when defined.',
      );
    }

    const required = new Set(
      Array.isArray(requestSchema.required)
        ? requestSchema.required.filter(
            (item): item is string => typeof item === 'string',
          )
        : [],
    );

    return Object.keys(rawProperties)
      .sort()
      .map((name) => {
        const parameterSchema = rawProperties[name];

        if (!isRecord(parameterSchema)) {
          throw new Error(
            `Request OpenAPI property "${name}" must define a valid schema object.`,
          );
        }

        return {
          in: 'query',
          name,
          required: required.has(name),
          schema: deepClone(parameterSchema),
        };
      });
  }

  private ensureRecord(
    value: unknown,
    errorMessage: string,
  ): Record<string, unknown> {
    if (!isRecord(value)) {
      throw new Error(errorMessage);
    }

    return value;
  }
}

interface BuildVersionOpenApiDocumentInput {
  version: ApiVersion;
  baseOpenApiDocument: Record<string, unknown>;
  openApiOperationTarget: OpenApiOperationTarget;
  requestSchema: z.ZodTypeAny;
  responseSchema: z.ZodTypeAny;
}

export function zodSchemaToOpenApiSchema(
  schema: z.ZodTypeAny,
  options?: {
    io?: 'input' | 'output';
  },
): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema, {
    target: 'openapi-3.0',
    reused: 'inline',
    unrepresentable: 'any',
    io: options?.io,
  });

  if (!isRecord(jsonSchema)) {
    throw new Error('Generated OpenAPI schema must be an object.');
  }

  return jsonSchema;
}
