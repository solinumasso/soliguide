import { Inject, Injectable } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cloneOpenApiSchema } from './openapi/openapi-schema.utils';
import { RequestOpenApiProjector } from './openapi/request-openapi.projector';
import { ResponseOpenApiProjector } from './openapi/response-openapi.projector';
import { RequestSchemaProjector } from './schema/request-schema.projector';
import { ResponseSchemaProjector } from './schema/response-schema.projector';
import { emitZodSchemaModule } from './schema/zod-schema.emitter';
import { isRecord } from '../utils/type-guards';
import { VersionRegistry } from '../versioning/version-registry';
import {
  ARTIFACTS_OUTPUT_DIRECTORY,
  OPENAPI_DECORATED_MODULE,
  OPENAPI_OPERATION_TARGET,
} from './artifact-generation.tokens';
import type {
  ApiVersion,
  OpenApiOperationTarget,
  OpenApiPropertySchema,
  RequestOpenApiSchemaCache,
  ResponseOpenApiSchemaCache,
} from '../versioning/versioning.types';

@Injectable()
export class ArtifactGenerationService {
  constructor(
    private readonly registry: VersionRegistry,
    private readonly requestOpenApiProjector: RequestOpenApiProjector,
    private readonly responseOpenApiProjector: ResponseOpenApiProjector,
    private readonly requestSchemaProjector: RequestSchemaProjector,
    private readonly responseSchemaProjector: ResponseSchemaProjector,
    @Inject(OPENAPI_DECORATED_MODULE)
    private readonly openApiDecoratedModule: Type<unknown>,
    @Inject(OPENAPI_OPERATION_TARGET)
    private readonly openApiOperationTarget: OpenApiOperationTarget,
    @Inject(ARTIFACTS_OUTPUT_DIRECTORY)
    private readonly outputDirectory: string,
  ) {}

  async generateArtifacts(): Promise<void> {
    const openApiDirectory = path.join(this.outputDirectory, 'openapi');
    const changelogDirectory = path.join(this.outputDirectory, 'changelog');
    const contractsDirectory = path.join(this.outputDirectory, 'contracts');

    await fs.mkdir(openApiDirectory, { recursive: true });
    await fs.mkdir(changelogDirectory, { recursive: true });
    await fs.mkdir(contractsDirectory, { recursive: true });

    const baseOpenApiDocument = await this.buildBaseOpenApiDocument();
    const requestOpenApiCache = this.buildRequestOpenApiCache();
    const responseOpenApiCache = this.buildResponseOpenApiCache();
    const requestSchemaCache =
      this.requestSchemaProjector.buildRequestSchemaCache(
        this.registry.definition.baseRequestSchema,
      );
    const responseSchemaCache =
      this.responseSchemaProjector.buildResponseSchemaCache(
        this.registry.definition.baseResponseSchema,
      );

    for (const version of this.registry.supportedVersions) {
      const requestOpenApi = requestOpenApiCache.get(version);
      const responseOpenApi = responseOpenApiCache.get(version);
      const requestSchema = requestSchemaCache.get(version);
      const responseSchema = responseSchemaCache.get(version);

      if (
        !requestOpenApi ||
        !responseOpenApi ||
        !requestSchema ||
        !responseSchema
      ) {
        throw new Error(
          `Missing artifact cache entry for API version ${version}.`,
        );
      }

      const openApiDocument = this.buildOpenApiDocument(
        baseOpenApiDocument,
        version,
        requestOpenApi,
        responseOpenApi,
      );

      await fs.writeFile(
        path.join(openApiDirectory, `${version}.json`),
        `${JSON.stringify(this.sortKeysDeep(openApiDocument), null, 2)}\n`,
        'utf8',
      );

      await fs.writeFile(
        path.join(changelogDirectory, `${version}.md`),
        this.buildVersionChangelog(version),
        'utf8',
      );

      await fs.writeFile(
        path.join(contractsDirectory, `${version}.request.schema.ts`),
        emitZodSchemaModule(requestSchema, {
          constName: this.toSchemaConstName(version, 'request'),
        }),
        'utf8',
      );

      await fs.writeFile(
        path.join(contractsDirectory, `${version}.response.schema.ts`),
        emitZodSchemaModule(responseSchema, {
          constName: this.toSchemaConstName(version, 'response'),
        }),
        'utf8',
      );
    }

    await fs.writeFile(
      path.join(contractsDirectory, 'index.ts'),
      this.buildContractsManifest(this.registry.supportedVersions),
      'utf8',
    );
  }

  private buildRequestOpenApiCache(): RequestOpenApiSchemaCache {
    return this.requestOpenApiProjector.buildRequestSchemaCache(
      this.registry.definition.baseRequestOpenApiSchema,
    );
  }

  private buildResponseOpenApiCache(): ResponseOpenApiSchemaCache {
    return this.responseOpenApiProjector.buildResponseSchemaCache(
      this.registry.definition.baseResponseOpenApiSchema,
    );
  }

  private buildVersionChangelog(version: ApiVersion): string {
    const compiledVersion = this.registry.compiledVersions.find(
      (candidate) => candidate.version === version,
    );

    if (!compiledVersion) {
      throw new Error(`Version ${version} is not defined in the registry.`);
    }

    const lines = [
      `# ${compiledVersion.version}`,
      '',
      compiledVersion.description,
      '',
      '## Request Changes',
      ...this.formatVersionChanges(compiledVersion.requestChanges),
      '',
      '## Response Changes',
      ...this.formatVersionChanges(compiledVersion.responseChanges),
      '',
    ];

    return lines.join('\n');
  }

  private formatVersionChanges(
    changes: readonly { description: string }[],
  ): string[] {
    if (changes.length === 0) {
      return ['- Initial version (no diff from previous version).'];
    }

    return changes.map((change) => `- ${change.description}`);
  }

  private buildOpenApiDocument(
    baseOpenApiDocument: Record<string, unknown>,
    version: ApiVersion,
    requestSchema: OpenApiPropertySchema,
    responseSchema: OpenApiPropertySchema,
  ): Record<string, unknown> {
    const document = cloneOpenApiSchema(baseOpenApiDocument);
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
      paths[this.openApiOperationTarget.path],
      `OpenAPI document is missing path "${this.openApiOperationTarget.path}".`,
    );

    const method = this.openApiOperationTarget.method;
    const operation = this.ensureRecord(
      pathItem[method],
      `OpenAPI document is missing operation "${method.toUpperCase()} ${this.openApiOperationTarget.path}".`,
    );

    operation.parameters = this.buildQueryParameters(requestSchema);

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
    applicationJsonContent.schema = cloneOpenApiSchema(responseSchema);

    return document;
  }

  private buildQueryParameters(
    requestSchema: OpenApiPropertySchema,
  ): Record<string, unknown>[] {
    if (!isRecord(requestSchema)) {
      throw new Error('Request OpenAPI schema must be an object schema.');
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
          schema: cloneOpenApiSchema(parameterSchema),
        };
      });
  }

  private async buildBaseOpenApiDocument(): Promise<Record<string, unknown>> {
    const app = await NestFactory.create(this.openApiDecoratedModule, {
      logger: false,
    });

    try {
      const config = new DocumentBuilder()
        .setTitle('Soliguide Search API')
        .setDescription(
          'Static operation metadata from decorators with versioned payload schemas.',
        )
        .setVersion(this.registry.canonicalVersion)
        .build();

      return SwaggerModule.createDocument(app, config) as unknown as Record<
        string,
        unknown
      >;
    } finally {
      await app.close();
    }
  }

  private sortKeysDeep(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sortKeysDeep(item));
    }

    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((accumulator, key) => {
          accumulator[key] = this.sortKeysDeep(
            (value as Record<string, unknown>)[key],
          );
          return accumulator;
        }, {});
    }

    return value;
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

  private toSchemaConstName(
    version: ApiVersion,
    kind: 'request' | 'response',
  ): string {
    const normalizedVersion = version.replace(/-/g, '');
    return `v${normalizedVersion}${kind === 'request' ? 'Request' : 'Response'}Schema`;
  }

  private buildContractsManifest(versions: readonly ApiVersion[]): string {
    const importLines: string[] = ["import { z } from 'zod';"];

    for (const version of versions) {
      importLines.push(
        `import { ${this.toSchemaConstName(version, 'request')} } from './${version}.request.schema';`,
      );
      importLines.push(
        `import { ${this.toSchemaConstName(version, 'response')} } from './${version}.response.schema';`,
      );
    }

    const requestEntries = versions
      .map(
        (version) =>
          `  ['${version}', ${this.toSchemaConstName(version, 'request')}] as [ApiVersion, z.ZodTypeAny],`,
      )
      .join('\n');
    const responseEntries = versions
      .map(
        (version) =>
          `  ['${version}', ${this.toSchemaConstName(version, 'response')}] as [ApiVersion, z.ZodTypeAny],`,
      )
      .join('\n');

    return [
      ...importLines,
      '',
      'type ApiVersion = `${number}-${number}-${number}`;',
      '',
      'export const requestSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>([',
      requestEntries,
      ']);',
      '',
      'export const responseSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>([',
      responseEntries,
      ']);',
      '',
    ].join('\n');
  }
}
