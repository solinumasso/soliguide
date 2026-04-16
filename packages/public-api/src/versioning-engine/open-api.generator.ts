import { writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

import { OpenAPIObject } from "@nestjs/swagger";
import { z } from "zod";

import { VersionRegistry } from "./version-registry";
import {
  ComponentsObject,
  ContentObject,
  MediaTypeObject,
  OperationObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export class OpenApiGenerator {
  constructor(
    private readonly defaultGetBaseOpenApiDocument?: OpenApiDocumentProvider
  ) {}

  public async generateVersionedOpenApi(
    options: GenerateVersionedOpenApiOptions
  ): Promise<string> {
    const version = this.validateVersion(options.version);
    const outputPath = this.validateOutputPath(options.outputPath);
    const baseOpenApiDocument = await this.resolveBaseOpenApiDocument(options);
    const workingOpenApiDocument = structuredClone(baseOpenApiDocument);

    const operationsById = this.collectSwaggerOperations(
      workingOpenApiDocument
    );
    const registryKey = this.toVersionRegistryKey(version);
    const currentVersionRegistry =
      options.versionRegistryByVersion[registryKey];

    if (!currentVersionRegistry) {
      throw new Error(
        `Missing registry for version ${version}. Expected key ${registryKey} in versionRegistryByVersion`
      );
    }

    this.assertRegistryCompleteness(operationsById, currentVersionRegistry);

    const enrichedOpenApiDocument = this.enrichOpenApiDocument(
      workingOpenApiDocument,
      operationsById,
      currentVersionRegistry
    );

    return this.writeGeneratedOpenApiJson(outputPath, enrichedOpenApiDocument);
  }

  private validateVersion(version: string): string {
    if (!version.trim()) {
      throw new Error("Version must be a non-empty string");
    }

    return version;
  }

  private validateOutputPath(outputPath: string): string {
    if (!outputPath.trim()) {
      throw new Error("outputPath must be a non-empty string");
    }

    const resolvedOutputPath = resolve(outputPath);
    if (resolvedOutputPath.endsWith(sep)) {
      throw new Error("outputPath must target a file path");
    }

    return resolvedOutputPath;
  }

  private toVersionRegistryKey(version: string): string {
    return `v${version.replaceAll("-", "")}`;
  }

  private async resolveBaseOpenApiDocument(
    options: GenerateVersionedOpenApiOptions
  ): Promise<OpenAPIObject> {
    if (options.baseOpenApiDocument) {
      return options.baseOpenApiDocument;
    }

    const getBaseOpenApiDocument =
      options.getBaseOpenApiDocument ?? this.defaultGetBaseOpenApiDocument;

    if (!getBaseOpenApiDocument) {
      throw new Error(
        "Missing base OpenAPI document input. Provide baseOpenApiDocument or getBaseOpenApiDocument."
      );
    }

    return getBaseOpenApiDocument();
  }

  private collectSwaggerOperations(
    openApiDocument: OpenAPIObject
  ): Map<string, SwaggerOperationRef> {
    const operationsById = new Map<string, SwaggerOperationRef>();
    const paths = openApiDocument.paths;

    for (const [pathKey, pathItem] of Object.entries(paths)) {
      for (const method of SUPPORTED_HTTP_METHODS) {
        const operation = pathItem[method];
        if (!operation) {
          continue;
        }

        const operationId = operation.operationId;
        if (typeof operationId !== "string" || operationId.trim() === "") {
          throw new Error(
            `Swagger operation ${method.toUpperCase()} ${pathKey} is missing operationId. Add @ApiOperation({ operationId: "..." })`
          );
        }

        const previous = operationsById.get(operationId);
        if (previous) {
          throw new Error(
            `Duplicate operationId "${operationId}" found for ${previous.method.toUpperCase()} ${
              previous.path
            } and ${method.toUpperCase()} ${pathKey}`
          );
        }

        operationsById.set(operationId, {
          method,
          operation,
          path: pathKey,
        });
      }
    }

    return operationsById;
  }

  private assertRegistryCompleteness(
    operationsById: Map<string, SwaggerOperationRef>,
    openApiRegistry: VersionRegistry
  ): void {
    const missingRegistryEntries = Array.from(operationsById.keys()).filter(
      (operationId) => !openApiRegistry[operationId]
    );

    const unknownRegistryEntries = Object.keys(openApiRegistry).filter(
      (operationId) => !operationsById.has(operationId)
    );

    if (!missingRegistryEntries.length && !unknownRegistryEntries.length) {
      return;
    }

    const details: string[] = [];

    if (missingRegistryEntries.length > 0) {
      details.push(
        `Missing registry entry for operationIds: ${missingRegistryEntries.join(
          ", "
        )}`
      );
    }

    if (unknownRegistryEntries.length > 0) {
      details.push(
        `Registry references unknown operationIds: ${unknownRegistryEntries.join(
          ", "
        )}`
      );
    }

    throw new Error(details.join(". "));
  }

  private enrichOpenApiDocument(
    openApiDocument: OpenAPIObject,
    operationsById: Map<string, SwaggerOperationRef>,
    versionRegistry: VersionRegistry
  ): OpenAPIObject {
    for (const [operationId, entry] of Object.entries(versionRegistry)) {
      const operationRef = operationsById.get(operationId);
      if (!operationRef) {
        continue;
      }

      if (entry.openApi.requestSchema) {
        this.attachRequestSchema(
          openApiDocument,
          operationId,
          operationRef.operation,
          entry.openApi.requestSchema
        );
      }

      const responses = entry.openApi.responses ?? {};
      for (const [statusCode, responseSchema] of Object.entries(responses)) {
        this.attachResponseSchema(
          openApiDocument,
          operationId,
          operationRef.operation,
          statusCode,
          responseSchema
        );
      }
    }

    return openApiDocument;
  }

  private async writeGeneratedOpenApiJson(
    outputPath: string,
    openApiDocument: OpenAPIObject
  ): Promise<string> {
    await writeFile(
      outputPath,
      `${JSON.stringify(openApiDocument, null, 2)}\n`,
      "utf-8"
    );

    return outputPath;
  }

  private attachRequestSchema(
    openApiDocument: OpenAPIObject,
    operationId: string,
    operation: OperationObject,
    requestSchema: z.ZodType
  ): void {
    const requestBody = this.readOpenApiObject<RequestBodyObject>(
      operation.requestBody
    );
    const content = this.readOpenApiObject<ContentObject>(requestBody.content);
    const applicationJson = this.readOpenApiObject<MediaTypeObject>(
      content["application/json"]
    );

    operation.requestBody = {
      ...requestBody,
      content: {
        ...content,
        "application/json": {
          ...applicationJson,
          schema: this.convertZodSchemaToOpenApiSchema(
            openApiDocument,
            requestSchema,
            "input",
            `${operationId}_request`
          ),
        },
      },
    };
  }

  private attachResponseSchema(
    openApiDocument: OpenAPIObject,
    operationId: string,
    operation: OperationObject,
    statusCode: string,
    responseSchema: z.ZodType
  ): void {
    const responses = this.readOpenApiObject<ResponsesObject>(
      operation.responses
    );
    const response = this.readOpenApiObject<ResponseObject>(
      responses[statusCode]
    );
    const content = this.readOpenApiObject<ContentObject>(response.content);
    const applicationJson = this.readOpenApiObject<MediaTypeObject>(
      content["application/json"]
    );

    operation.responses = {
      ...responses,
      [statusCode]: {
        ...response,
        content: {
          ...content,
          "application/json": {
            ...applicationJson,
            schema: this.convertZodSchemaToOpenApiSchema(
              openApiDocument,
              responseSchema,
              "output",
              `${operationId}_response_${statusCode}`
            ),
          },
        },
      },
    };
  }

  private convertZodSchemaToOpenApiSchema(
    openApiDocument: OpenAPIObject,
    schema: z.ZodType,
    io: "input" | "output",
    componentPrefix: string
  ): SchemaObject {
    const jsonSchema = z.toJSONSchema(schema, {
      ...OPEN_API_JSON_SCHEMA_OPTIONS,
      io,
    }) as JsonSchemaNode;

    return this.promoteJsonSchemaDefinitions(
      openApiDocument,
      jsonSchema,
      componentPrefix
    ) as SchemaObject;
  }

  private promoteJsonSchemaDefinitions(
    openApiDocument: OpenAPIObject,
    schema: JsonSchemaNode,
    componentPrefix: string
  ): JsonSchemaNode {
    const definitions = this.readDefinitions(schema);

    delete schema.definitions;
    delete schema.$defs;

    if (!definitions || Object.keys(definitions).length === 0) {
      return schema;
    }

    const components = this.ensureComponents(openApiDocument);
    const componentSchemas = (components.schemas ??= {});
    const refMap = new Map<string, string>();

    for (const [definitionName, definitionSchema] of Object.entries(
      definitions
    )) {
      const componentName = this.resolveComponentName(
        componentSchemas,
        definitionName,
        definitionSchema,
        componentPrefix
      );

      componentSchemas[componentName] = definitionSchema as
        | SchemaObject
        | ReferenceObject;

      refMap.set(
        `#/definitions/${definitionName}`,
        `#/components/schemas/${componentName}`
      );
      refMap.set(
        `#/$defs/${definitionName}`,
        `#/components/schemas/${componentName}`
      );
    }

    this.rewriteRefs(schema, refMap);

    for (const componentName of refMap.values()) {
      const normalizedComponentName = componentName.replace(
        "#/components/schemas/",
        ""
      );
      const componentSchema = componentSchemas[normalizedComponentName];

      if (this.isRecord(componentSchema)) {
        this.rewriteRefs(componentSchema, refMap);
      }
    }

    return schema;
  }

  private readDefinitions(
    schema: JsonSchemaNode
  ): Record<string, JsonSchemaNode> | null {
    const definitions = schema.definitions ?? schema.$defs;

    if (!this.isRecord(definitions)) {
      return null;
    }

    return definitions as Record<string, JsonSchemaNode>;
  }

  private ensureComponents(openApiDocument: OpenAPIObject): ComponentsObject {
    openApiDocument.components ??= {};

    return openApiDocument.components;
  }

  private resolveComponentName(
    componentSchemas: Record<string, SchemaObject | ReferenceObject>,
    definitionName: string,
    definitionSchema: JsonSchemaNode,
    componentPrefix: string
  ): string {
    const preferredName = this.prefixedComponentName(
      definitionName,
      componentPrefix
    );
    const existingSchema = componentSchemas[preferredName];

    if (!existingSchema) {
      return preferredName;
    }

    if (this.areEquivalentSchemas(existingSchema, definitionSchema)) {
      return preferredName;
    }

    let index = 1;
    let candidateName = `${preferredName}_${index}`;

    while (componentSchemas[candidateName]) {
      if (
        this.areEquivalentSchemas(
          componentSchemas[candidateName],
          definitionSchema
        )
      ) {
        return candidateName;
      }

      index += 1;
      candidateName = `${preferredName}_${index}`;
    }

    return candidateName;
  }

  private prefixedComponentName(
    definitionName: string,
    componentPrefix: string
  ): string {
    if (/^(__schema\d+|schema\d+)$/.test(definitionName)) {
      return `${this.sanitizeComponentName(componentPrefix)}_${definitionName}`;
    }

    return definitionName;
  }

  private sanitizeComponentName(value: string): string {
    return value.replace(/[^A-Za-z0-9._-]/g, "_");
  }

  private areEquivalentSchemas(
    left: SchemaObject | ReferenceObject,
    right: JsonSchemaNode
  ): boolean {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  private rewriteRefs(value: unknown, refMap: Map<string, string>): void {
    if (Array.isArray(value)) {
      for (const item of value) {
        this.rewriteRefs(item, refMap);
      }

      return;
    }

    if (!this.isRecord(value)) {
      return;
    }

    if (typeof value.$ref === "string") {
      value.$ref = refMap.get(value.$ref) ?? value.$ref;
    }

    for (const nestedValue of Object.values(value)) {
      this.rewriteRefs(nestedValue, refMap);
    }
  }

  private readOpenApiObject<T extends object>(
    candidate: T | ReferenceObject | undefined
  ): T {
    if (!this.isRecord(candidate)) {
      return {} as T;
    }

    if ("$ref" in candidate) {
      return {} as T;
    }

    return candidate as T;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }
}

type SwaggerOperationRef = {
  method: string;
  operation: OperationObject;
  path: string;
};

type JsonSchemaNode = Record<string, unknown>;
export type OpenApiDocumentProvider = () => Promise<OpenAPIObject>;

type GenerateVersionedOpenApiOptionsBase = {
  baseOpenApiDocument?: OpenAPIObject;
  getBaseOpenApiDocument?: OpenApiDocumentProvider;
  outputPath: string;
  version: string;
  versionRegistryByVersion: Record<string, VersionRegistry>;
};
export type GenerateVersionedOpenApiOptions =
  GenerateVersionedOpenApiOptionsBase;

const OPEN_API_JSON_SCHEMA_OPTIONS = {
  reused: "inline",
  target: "openapi-3.0",
  unrepresentable: "any",
} as const;
const SUPPORTED_HTTP_METHODS = [
  "delete",
  "get",
  "head",
  "options",
  "patch",
  "post",
  "put",
  "trace",
] as const;
