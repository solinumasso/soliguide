import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { OpenAPIObject } from "@nestjs/swagger";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { OpenApiGenerator } from "./open-api.generator";
import type { VersionRegistry } from "./version-registry";

type OpenApiNode = Record<string, unknown>;

const VERSION = "2026-01-01";
const VERSION_REGISTRY_KEY = "v20260101";
const OPEN_API_JSON_SCHEMA_OPTIONS = {
  reused: "inline",
  target: "openapi-3.0",
  unrepresentable: "any",
} as const;

let tempDirectoryPath = "";
let outputPath = "";

beforeEach(async () => {
  tempDirectoryPath = await mkdtemp(join(tmpdir(), "open-api-generator-"));
  outputPath = join(tempDirectoryPath, `${VERSION}.openapi.generated.json`);
});

afterEach(async () => {
  await rm(tempDirectoryPath, { force: true, recursive: true });
});

describe("OpenApiGenerator", () => {
  it("generates JSON at the provided output path and preserves Swagger metadata", async () => {
    const generator = new OpenApiGenerator();
    const baseOpenApiDocument = createBaseOpenApiDocument();

    const generatedOutputPath = await generator.generateVersionedOpenApi({
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({ query: z.string() }),
            responses: {
              200: z.object({
                results: z.array(z.string()),
              }),
            },
          },
        },
      }),
      getBaseOpenApiDocument: async () => baseOpenApiDocument,
    });

    expect(generatedOutputPath).toBe(outputPath);

    const generatedDocument = await readGeneratedDocument(outputPath);
    const generatedSearchPostOperation = readOperation(
      generatedDocument,
      "/search",
      "post"
    );

    expect(generatedSearchPostOperation.operationId).toBe("search-places");
    expect(generatedSearchPostOperation.summary).toBe("Search places");
    expect(generatedSearchPostOperation.tags).toEqual(["search"]);
    expect(readResponseDescription(generatedSearchPostOperation, "200")).toBe(
      "Search results"
    );
  });

  it("injects request and response schemas into application/json slots", async () => {
    const generator = new OpenApiGenerator();
    const baseOpenApiDocument = createBaseOpenApiDocument();

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument,
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({
              filters: z.object({
                city: z.string(),
              }),
            }),
            responses: {
              200: z.object({
                total: z.number().int(),
              }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const generatedSearchPostOperation = readOperation(
      generatedDocument,
      "/search",
      "post"
    );

    expect(readRequestJsonSchema(generatedSearchPostOperation)).toMatchObject({
      type: "object",
    });
    expect(readResponseJsonSchema(generatedSearchPostOperation, "200")).toMatchObject(
      {
        type: "object",
      }
    );
  });

  it("omits implicit safe integer bounds for unconstrained int fields", async () => {
    const generator = new OpenApiGenerator();

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument: createBaseOpenApiDocument(),
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({
              plain: z.number().int(),
              minOnly: z.number().int().min(0),
              maxOnly: z.number().int().max(5),
              bounded: z.number().int().min(1).max(9),
            }),
            responses: {
              200: z.object({ ok: z.boolean() }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const requestSchema = asOpenApiNode(
      readRequestJsonSchema(readOperation(generatedDocument, "/search", "post"))
    );
    const properties = asOpenApiNode(requestSchema.properties);

    expect(asOpenApiNode(properties.plain)).toEqual({
      type: "integer",
    });
    expect(asOpenApiNode(properties.minOnly)).toEqual({
      minimum: 0,
      type: "integer",
    });
    expect(asOpenApiNode(properties.maxOnly)).toEqual({
      maximum: 5,
      type: "integer",
    });
    expect(asOpenApiNode(properties.bounded)).toEqual({
      maximum: 9,
      minimum: 1,
      type: "integer",
    });
  });

  it("promotes reused definitions to components.schemas and removes definitions/$defs", async () => {
    const generator = new OpenApiGenerator();
    const sharedNestedObject = z
      .object({
        code: z.string(),
        count: z.number().int(),
      })
      .meta({ id: "SharedNestedObject" });
    const requestSchema = z.object({
      first: sharedNestedObject,
      second: sharedNestedObject,
    });
    const responseSchema = z.object({
      items: z.array(sharedNestedObject),
      primary: sharedNestedObject,
    });

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument: createBaseOpenApiDocument(),
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema,
            responses: {
              200: responseSchema,
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const componentSchemas = asOpenApiNode(
      asOpenApiNode(generatedDocument.components).schemas
    );

    expect(Object.keys(componentSchemas).length).toBeGreaterThan(0);
    expect(findDefinitionsNodes(generatedDocument)).toHaveLength(0);
    expect(findRefs(generatedDocument)).toContain(
      "#/components/schemas/SharedNestedObject"
    );
  });

  it("keeps anonymous reused schemas inline", async () => {
    const generator = new OpenApiGenerator();
    const anonymousSharedObject = z.object({
      code: z.string(),
      count: z.number().int(),
    });

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument: createBaseOpenApiDocument(),
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({
              first: anonymousSharedObject,
              second: anonymousSharedObject,
            }),
            responses: {
              200: z.object({
                primary: anonymousSharedObject,
                items: z.array(anonymousSharedObject),
              }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const refs = findRefs(generatedDocument);
    const componentSchemas = asOpenApiNode(
      asOpenApiNode(generatedDocument.components).schemas
    );

    expect(
      refs.some((ref) => ref.includes("__schema") || ref.includes("schema0"))
    ).toBe(false);
    expect(
      Object.keys(componentSchemas).some(
        (componentName) =>
          componentName.includes("__schema") || componentName.includes("schema0")
      )
    ).toBe(false);
  });

  it("rewrites promoted refs to components.schemas", async () => {
    const generator = new OpenApiGenerator();
    const promotedSchema = z
      .object({
        slug: z.string(),
      })
      .meta({ id: "PromotedRefTarget" });

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument: createBaseOpenApiDocument(),
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({ payload: promotedSchema }),
            responses: {
              200: z.object({ payload: promotedSchema }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const refs = findRefs(generatedDocument);

    expect(refs.some((ref) => ref.startsWith("#/definitions/"))).toBe(false);
    expect(refs.some((ref) => ref.startsWith("#/$defs/"))).toBe(false);
    expect(refs).toContain("#/components/schemas/PromotedRefTarget");
  });

  it("reuses an existing component name when schemas are equivalent", async () => {
    const generator = new OpenApiGenerator();
    const reusablePayload = z
      .object({
        value: z.string(),
      })
      .meta({ id: "ReusablePayload" });
    const reusablePayloadDefinition = readSchemaDefinition(
      z.object({ payload: reusablePayload }),
      "ReusablePayload",
      "input"
    );
    const baseOpenApiDocument = createBaseOpenApiDocument();

    baseOpenApiDocument.components = {
      ...(baseOpenApiDocument.components ?? {}),
      schemas: {
        ...((baseOpenApiDocument.components ?? {}).schemas ?? {}),
        ReusablePayload: reusablePayloadDefinition,
      },
    };

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument,
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({ body: reusablePayload }),
            responses: {
              200: z.object({ ok: z.boolean() }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const componentSchemas = asOpenApiNode(
      asOpenApiNode(generatedDocument.components).schemas
    );

    expect(componentSchemas.ReusablePayload).toBeDefined();
    expect(componentSchemas.ReusablePayload_1).toBeUndefined();
  });

  it("suffixes component names when preferred name exists with a different schema", async () => {
    const generator = new OpenApiGenerator();
    const requestPayload = z
      .object({
        value: z.string(),
      })
      .meta({ id: "CollisionPayload" });
    const responsePayload = z
      .object({
        value: z.number(),
      })
      .meta({ id: "CollisionPayload" });

    await generator.generateVersionedOpenApi({
      baseOpenApiDocument: createBaseOpenApiDocument(),
      outputPath,
      version: VERSION,
      versionRegistryByVersion: createRegistryByVersion({
        "search-places": {
          openApi: {
            requestSchema: z.object({ body: requestPayload }),
            responses: {
              200: z.object({ body: responsePayload }),
            },
          },
        },
      }),
    });

    const generatedDocument = await readGeneratedDocument(outputPath);
    const componentSchemas = asOpenApiNode(
      asOpenApiNode(generatedDocument.components).schemas
    );

    expect(componentSchemas.CollisionPayload).toBeDefined();
    expect(componentSchemas.CollisionPayload_1).toBeDefined();
  });

  it("throws when the requested version key is absent from the provided registry map", async () => {
    const generator = new OpenApiGenerator();

    await expect(
      generator.generateVersionedOpenApi({
        baseOpenApiDocument: createBaseOpenApiDocument(),
        outputPath,
        version: VERSION,
        versionRegistryByVersion: {},
      })
    ).rejects.toThrow(/Missing registry for version 2026-01-01/);
  });

  it("throws when a Swagger operation has no registry entry", async () => {
    const generator = new OpenApiGenerator();

    await expect(
      generator.generateVersionedOpenApi({
        baseOpenApiDocument: createBaseOpenApiDocument(),
        outputPath,
        version: VERSION,
        versionRegistryByVersion: createRegistryByVersion({}),
      })
    ).rejects.toThrow(/Missing registry entry/);
  });

  it("throws when the registry references an unknown operationId", async () => {
    const generator = new OpenApiGenerator();

    await expect(
      generator.generateVersionedOpenApi({
        baseOpenApiDocument: createBaseOpenApiDocument(),
        outputPath,
        version: VERSION,
        versionRegistryByVersion: createRegistryByVersion({
          "search-places": {
            openApi: {
              requestSchema: z.object({ query: z.string() }),
              responses: {
                200: z.object({ ok: z.boolean() }),
              },
            },
          },
          "missing-operation": {
            openApi: {
              responses: {
                200: z.object({ ok: z.boolean() }),
              },
            },
          },
        }),
      })
    ).rejects.toThrow(/unknown operationIds/);
  });

  it("throws when a Swagger operation is missing operationId", async () => {
    const generator = new OpenApiGenerator();

    await expect(
      generator.generateVersionedOpenApi({
        baseOpenApiDocument: createBaseOpenApiDocument({
          missingOperationId: true,
        }),
        outputPath,
        version: VERSION,
        versionRegistryByVersion: createRegistryByVersion({
          "search-places": {
            openApi: {
              requestSchema: z.object({ query: z.string() }),
              responses: {
                200: z.object({ ok: z.boolean() }),
              },
            },
          },
        }),
      })
    ).rejects.toThrow(/missing operationId/);
  });

  it("throws when two operations share the same operationId", async () => {
    const generator = new OpenApiGenerator();

    await expect(
      generator.generateVersionedOpenApi({
        baseOpenApiDocument: createBaseOpenApiDocument({
          duplicateOperationId: true,
          includeSecondOperation: true,
        }),
        outputPath,
        version: VERSION,
        versionRegistryByVersion: createRegistryByVersion({
          "search-places": {
            openApi: {
              requestSchema: z.object({ query: z.string() }),
              responses: {
                200: z.object({ ok: z.boolean() }),
              },
            },
          },
        }),
      })
    ).rejects.toThrow(/Duplicate operationId/);
  });
});

function createRegistryByVersion(
  currentVersionRegistry: VersionRegistry
): Record<string, VersionRegistry> {
  return {
    [VERSION_REGISTRY_KEY]: currentVersionRegistry,
  };
}

function createBaseOpenApiDocument(options?: {
  duplicateOperationId?: boolean;
  includeSecondOperation?: boolean;
  missingOperationId?: boolean;
}): OpenAPIObject {
  const searchOperation = {
    summary: "Search places",
    tags: ["search"],
    requestBody: {
      content: {
        "application/json": {},
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {},
        },
        description: "Search results",
      },
    },
  } as OpenApiNode;

  if (!options?.missingOperationId) {
    searchOperation.operationId = "search-places";
  }

  const paths: OpenApiNode = {
    "/search": {
      post: searchOperation,
    },
  };

  if (options?.includeSecondOperation) {
    paths["/search-secondary"] = {
      post: {
        operationId: options.duplicateOperationId
          ? "search-places"
          : "search-places-secondary",
        responses: {
          200: {
            description: "Secondary response",
          },
        },
      },
    };
  }

  return {
    components: {},
    info: {
      title: "Test API",
      version: "1.0",
    },
    openapi: "3.0.0",
    paths,
  } as OpenAPIObject;
}

async function readGeneratedDocument(path: string): Promise<OpenApiNode> {
  return JSON.parse(await readFile(path, "utf-8")) as OpenApiNode;
}

function readOperation(
  openApiDocument: OpenApiNode,
  path: string,
  method: string
): OpenApiNode {
  const paths = asOpenApiNode(openApiDocument.paths);
  const pathNode = asOpenApiNode(paths[path]);
  const operation = asOpenApiNode(pathNode[method]);

  expect(operation.operationId).toBeDefined();

  return operation;
}

function readRequestJsonSchema(operation: OpenApiNode): unknown {
  const requestBody = asOpenApiNode(operation.requestBody);
  const content = asOpenApiNode(requestBody.content);
  const applicationJson = asOpenApiNode(content["application/json"]);

  return applicationJson.schema;
}

function readResponseJsonSchema(
  operation: OpenApiNode,
  statusCode: string
): unknown {
  const responses = asOpenApiNode(operation.responses);
  const response = asOpenApiNode(responses[statusCode]);
  const content = asOpenApiNode(response.content);
  const applicationJson = asOpenApiNode(content["application/json"]);

  return applicationJson.schema;
}

function readResponseDescription(
  operation: OpenApiNode,
  statusCode: string
): unknown {
  const responses = asOpenApiNode(operation.responses);
  const response = asOpenApiNode(responses[statusCode]);

  return response.description;
}

function asOpenApiNode(value: unknown): OpenApiNode {
  return (value as OpenApiNode | undefined) ?? {};
}

function findDefinitionsNodes(
  value: unknown,
  matches: OpenApiNode[] = []
): OpenApiNode[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      findDefinitionsNodes(item, matches);
    }

    return matches;
  }

  if (!value || typeof value !== "object") {
    return matches;
  }

  const node = value as OpenApiNode;
  if ("definitions" in node || "$defs" in node) {
    matches.push(node);
  }

  for (const nestedValue of Object.values(node)) {
    findDefinitionsNodes(nestedValue, matches);
  }

  return matches;
}

function findRefs(value: unknown, refs: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      findRefs(item, refs);
    }

    return refs;
  }

  if (!value || typeof value !== "object") {
    return refs;
  }

  const node = value as OpenApiNode;
  if (typeof node.$ref === "string") {
    refs.push(node.$ref);
  }

  for (const nestedValue of Object.values(node)) {
    findRefs(nestedValue, refs);
  }

  return refs;
}

function readSchemaDefinition(
  schema: z.ZodType,
  definitionName: string,
  io: "input" | "output"
): OpenApiNode {
  const jsonSchema = z.toJSONSchema(schema, {
    ...OPEN_API_JSON_SCHEMA_OPTIONS,
    io,
  }) as OpenApiNode;
  const definitions = asOpenApiNode(jsonSchema.definitions ?? jsonSchema.$defs);

  return asOpenApiNode(definitions[definitionName]);
}
