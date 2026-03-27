import { z } from 'zod';
import { ContractOpenApiGenerator } from './contract-openapi.generator';
import type { OpenApiOperationTarget } from '../../versioning/versioning.types';

const operationTarget: OpenApiOperationTarget = {
  method: 'get',
  path: '/catalog',
};

const postOperationTarget: OpenApiOperationTarget = {
  method: 'post',
  path: '/catalog',
};

const baseOpenApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Catalog API',
    version: '2026-03-03',
  },
  paths: {
    '/catalog': {
      get: {
        operationId: 'catalog_search',
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
        },
      },
    },
  },
};

describe('ContractOpenApiGenerator', () => {
  it('generates request and response OpenAPI schemas from Zod schemas', () => {
    const requestSchema = z
      .object({
        page: z.coerce.number().int().min(1).optional(),
        isOpenToday: z.coerce
          .boolean()
          .optional()
          .describe('Filter by opening status')
          .meta({ example: true }),
      })
      .strict();

    const responseSchema = z
      .object({
        results: z.array(
          z
            .object({
              name: z
                .string()
                .describe('Localized place name')
                .meta({ example: 'Maison Solidaire' }),
            })
            .strict(),
        ),
      })
      .strict();

    const generator = new ContractOpenApiGenerator();
    const document = generator.buildVersionOpenApiDocument({
      version: '2026-03-09',
      baseOpenApiDocument,
      openApiOperationTarget: operationTarget,
      requestSchema,
      responseSchema,
    });

    const getOperation = (
      (document.paths as Record<string, unknown>)['/catalog'] as Record<
        string,
        unknown
      >
    ).get as Record<string, unknown>;
    const parameters = getOperation.parameters as Array<
      Record<string, unknown>
    >;

    expect(parameters.map((parameter) => parameter.name)).toEqual([
      'isOpenToday',
      'page',
    ]);

    const response = (getOperation.responses as Record<string, unknown>)[
      '200'
    ] as Record<string, unknown>;
    const responseSchemaNode = (
      (response.content as Record<string, unknown>)[
        'application/json'
      ] as Record<string, unknown>
    ).schema as Record<string, unknown>;
    const resultItemNameSchema = (
      (
        (
          (responseSchemaNode.properties as Record<string, unknown>)
            .results as Record<string, unknown>
        ).items as Record<string, unknown>
      ).properties as Record<string, unknown>
    ).name as Record<string, unknown>;

    expect(resultItemNameSchema.description).toBe('Localized place name');
    expect(resultItemNameSchema.example).toBe('Maison Solidaire');
  });

  it('produces deterministic output for repeated generation', () => {
    const requestSchema = z.object({ page: z.number().optional() }).strict();
    const responseSchema = z.object({ ok: z.boolean() }).strict();

    const generator = new ContractOpenApiGenerator();

    const first = generator.buildVersionOpenApiDocument({
      version: '2026-03-09',
      baseOpenApiDocument,
      openApiOperationTarget: operationTarget,
      requestSchema,
      responseSchema,
    });
    const second = generator.buildVersionOpenApiDocument({
      version: '2026-03-09',
      baseOpenApiDocument,
      openApiOperationTarget: operationTarget,
      requestSchema,
      responseSchema,
    });

    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it('fails when request root is not a z.object schema', () => {
    const generator = new ContractOpenApiGenerator();

    expect(() =>
      generator.buildVersionOpenApiDocument({
        version: '2026-03-09',
        baseOpenApiDocument,
        openApiOperationTarget: operationTarget,
        requestSchema: z.string(),
        responseSchema: z.object({ ok: z.boolean() }).strict(),
      }),
    ).toThrow('Request schema root must be a z.object');
  });

  it('uses requestBody schema for non-GET operations', () => {
    const generator = new ContractOpenApiGenerator();
    const requestSchema = z
      .object({
        title: z.string(),
        tags: z.array(z.string()).optional(),
      })
      .strict();
    const responseSchema = z.object({ ok: z.boolean() }).strict();
    const document = generator.buildVersionOpenApiDocument({
      version: '2026-03-09',
      baseOpenApiDocument: {
        ...baseOpenApiDocument,
        paths: {
          ...baseOpenApiDocument.paths,
          '/catalog': {
            ...baseOpenApiDocument.paths['/catalog'],
            post: {
              operationId: 'catalog_create',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
      openApiOperationTarget: postOperationTarget,
      requestSchema,
      responseSchema,
    });

    const postOperation = (
      (document.paths as Record<string, unknown>)['/catalog'] as Record<
        string,
        unknown
      >
    ).post as Record<string, unknown>;
    expect(postOperation.parameters).toBeUndefined();

    const requestBody = postOperation.requestBody as Record<string, unknown>;
    const content = requestBody.content as Record<string, unknown>;
    const requestSchemaNode = (
      content['application/json'] as Record<string, unknown>
    ).schema as Record<string, unknown>;
    const properties = requestSchemaNode.properties as Record<string, unknown>;
    expect(requestSchemaNode.type).toBe('object');
    expect(properties).toHaveProperty('title');
    expect(properties).toHaveProperty('tags');
  });

  it('handles request transforms by documenting input schema', () => {
    const generator = new ContractOpenApiGenerator();
    const requestSchema = z
      .object({
        accessModes: z
          .union([z.string(), z.array(z.string())])
          .transform((value) => (Array.isArray(value) ? value : [value]))
          .optional(),
      })
      .strict();
    const responseSchema = z.object({ ok: z.boolean() }).strict();

    const document = generator.buildVersionOpenApiDocument({
      version: '2026-03-23',
      baseOpenApiDocument,
      openApiOperationTarget: operationTarget,
      requestSchema,
      responseSchema,
    });

    const getOperation = (
      (document.paths as Record<string, unknown>)['/catalog'] as Record<
        string,
        unknown
      >
    ).get as Record<string, unknown>;
    const parameters = getOperation.parameters as Array<
      Record<string, unknown>
    >;
    const accessModesParameter = parameters.find(
      (parameter) => parameter.name === 'accessModes',
    );

    expect(accessModesParameter).toBeDefined();
    expect(
      ((accessModesParameter as Record<string, unknown>).schema as Record<
        string,
        unknown
      >).anyOf,
    ).toBeDefined();
  });
});
