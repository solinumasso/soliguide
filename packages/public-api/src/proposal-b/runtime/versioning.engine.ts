/* eslint-disable @typescript-eslint/no-require-imports */
import { Inject, Injectable, Type } from '@nestjs/common';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { z } from 'zod';
import { cloneOpenApiSchema } from '../projection/openapi/openapi-schema.utils';
import {
  OPENAPI_OPERATION_TARGET,
  REQUEST_SCHEMAS_BY_VERSION,
  RESPONSE_SCHEMAS_BY_VERSION,
} from '../app/search.tokens';
import { RequestOpenApiProjector } from '../projection/openapi/request-openapi.projector';
import { RequestSchemaProjector } from '../projection/schema/request-schema.projector';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseOpenApiProjector } from '../projection/openapi/response-openapi.projector';
import { ResponseSchemaProjector } from '../projection/schema/response-schema.projector';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import { emitZodSchemaModule } from '../projection/schema/zod-schema.emitter';
import type {
  ApiVersion,
  OpenApiOperationTarget,
  OpenApiPropertySchema,
  RequestOpenApiSchemaCache,
  ResponseOpenApiSchemaCache,
  ValidationSchemaCache,
  VersionTransformContext,
} from '../versioning/versioning.types';

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeysDeep(item));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = sortKeysDeep(
          (value as Record<string, unknown>)[key],
        );
        return accumulator;
      }, {});
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function ensureRecord(
  value: unknown,
  errorMessage: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(errorMessage);
  }

  return value;
}

function normalizeRequired(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function toSchemaConstName(
  version: ApiVersion,
  kind: 'request' | 'response',
): string {
  const normalizedVersion = version.replace(/-/g, '');
  return `v${normalizedVersion}${kind === 'request' ? 'Request' : 'Response'}Schema`;
}

function buildContractsManifest(versions: readonly ApiVersion[]): string {
  const importLines: string[] = [
    "import { z } from 'zod';",
    "import type { ApiVersion } from '../../versioning/versioning.types';",
  ];

  for (const version of versions) {
    importLines.push(
      `import { ${toSchemaConstName(version, 'request')} } from './${version}.request.schema';`,
    );
    importLines.push(
      `import { ${toSchemaConstName(version, 'response')} } from './${version}.response.schema';`,
    );
  }

  const requestEntries = versions
    .map(
      (version) =>
        `  ['${version}', ${toSchemaConstName(version, 'request')}] as [ApiVersion, z.ZodTypeAny],`,
    )
    .join('\n');
  const responseEntries = versions
    .map(
      (version) =>
        `  ['${version}', ${toSchemaConstName(version, 'response')}] as [ApiVersion, z.ZodTypeAny],`,
    )
    .join('\n');

  return [
    ...importLines,
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

@Injectable()
export class VersioningEngine {
  private readonly outputDirectory = path.resolve(__dirname, '..', 'generated');

  constructor(
    private readonly registry: VersionRegistry,
    private readonly versionResolver: VersionResolver,
    private readonly requestVersioningPipeline: RequestVersioningPipeline,
    private readonly responseVersioningPipeline: ResponseVersioningPipeline,
    private readonly requestOpenApiProjector: RequestOpenApiProjector,
    private readonly responseOpenApiProjector: ResponseOpenApiProjector,
    private readonly requestSchemaProjector: RequestSchemaProjector,
    private readonly responseSchemaProjector: ResponseSchemaProjector,
    @Inject(OPENAPI_OPERATION_TARGET)
    private readonly openApiOperationTarget: OpenApiOperationTarget,
    @Inject(REQUEST_SCHEMAS_BY_VERSION)
    private readonly requestSchemasByVersion: ValidationSchemaCache,
    @Inject(RESPONSE_SCHEMAS_BY_VERSION)
    private readonly responseSchemasByVersion: ValidationSchemaCache,
  ) {}

  async upgradeRequest(
    input: unknown,
    versionHeader: string | null | undefined,
    context: VersionTransformContext = {},
  ): Promise<unknown> {
    return this.requestVersioningPipeline.upgradeRequest(
      input,
      versionHeader,
      context,
    );
  }

  async downgradeResponse(
    output: unknown,
    versionHeader: string | null | undefined,
    context: VersionTransformContext = {},
  ): Promise<unknown> {
    return this.responseVersioningPipeline.downgradeResponse(
      output,
      versionHeader,
      context,
    );
  }

  getRequestSchema(version: string): z.ZodTypeAny {
    const { normalizedVersion } = this.versionResolver.resolveVersion(
      version,
      this.registry.supportedVersions,
      this.registry.canonicalVersion,
    );

    const schema = this.requestSchemasByVersion.get(normalizedVersion);
    if (!schema) {
      throw new Error(
        `Missing request schema for version ${normalizedVersion}.`,
      );
    }

    return schema;
  }

  getResponseSchema(version: string): z.ZodTypeAny {
    const { normalizedVersion } = this.versionResolver.resolveVersion(
      version,
      this.registry.supportedVersions,
      this.registry.canonicalVersion,
    );

    const schema = this.responseSchemasByVersion.get(normalizedVersion);
    if (!schema) {
      throw new Error(
        `Missing response schema for version ${normalizedVersion}.`,
      );
    }

    return schema;
  }

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
        `${JSON.stringify(sortKeysDeep(openApiDocument), null, 2)}\n`,
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
          constName: toSchemaConstName(version, 'request'),
        }),
        'utf8',
      );

      await fs.writeFile(
        path.join(contractsDirectory, `${version}.response.schema.ts`),
        emitZodSchemaModule(responseSchema, {
          constName: toSchemaConstName(version, 'response'),
        }),
        'utf8',
      );
    }

    await fs.writeFile(
      path.join(contractsDirectory, 'index.ts'),
      buildContractsManifest(this.registry.supportedVersions),
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
    const info = ensureRecord(
      document.info,
      'OpenAPI document is missing info.',
    );
    info.version = version;

    const paths = ensureRecord(
      document.paths,
      'OpenAPI document is missing paths.',
    );
    const pathItem = ensureRecord(
      paths[this.openApiOperationTarget.path],
      `OpenAPI document is missing path "${this.openApiOperationTarget.path}".`,
    );

    const method = this.openApiOperationTarget.method;
    const operation = ensureRecord(
      pathItem[method],
      `OpenAPI document is missing operation "${method.toUpperCase()} ${this.openApiOperationTarget.path}".`,
    );

    operation.parameters = this.buildQueryParameters(requestSchema);

    const responses = ensureRecord(
      operation.responses ?? {},
      'OpenAPI operation responses must be an object when defined.',
    );
    operation.responses = responses;

    const okResponse = ensureRecord(
      responses['200'] ?? {},
      'OpenAPI response "200" must be an object when defined.',
    );
    responses['200'] = okResponse;
    if (typeof okResponse.description !== 'string') {
      okResponse.description = 'Successful search response';
    }

    const content = ensureRecord(
      okResponse.content ?? {},
      'OpenAPI response content must be an object when defined.',
    );
    okResponse.content = content;

    const applicationJsonContent = ensureRecord(
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

    const required = new Set(normalizeRequired(requestSchema.required));

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
    const { ProposalCModule } = require('../app/proposal-b.module') as {
      ProposalCModule: Type<unknown>;
    };

    const app = await NestFactory.create(ProposalCModule, {
      logger: false,
    });

    try {
      const config = new DocumentBuilder()
        .setTitle('Soliguide Search API - Proposal B')
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
}
