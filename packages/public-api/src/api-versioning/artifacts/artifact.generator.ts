import { promises as fs } from 'fs';
import * as path from 'path';
import { Inject, Injectable, Optional } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ChangelogGenerator } from './changelog/changelog.generator';
import { ContractOpenApiGenerator } from './openapi/contract-openapi.generator';
import {
  VersionedSchemaGenerator,
  type GenerateVersionedSchemasResult,
} from './schema/versioned-schema.generator';
import { VersionRegistry } from '../versioning/version-registry';
import {
  ARTIFACTS_OUTPUT_DIRECTORY,
  FIRST_VERSION_SCHEMA_SEED_CONFIG,
  OPENAPI_DECORATED_MODULE,
  OPENAPI_OPERATION_TARGET,
  type FirstVersionSchemaSeedConfig,
} from './artifact-generation.tokens';
import type {
  ApiVersion,
  CompiledVersion,
  OpenApiOperationTarget,
} from '../versioning/versioning.types';

@Injectable()
export class ArtifactGenerationService {
  private readonly versionedSchemaGenerator = new VersionedSchemaGenerator();
  private readonly contractOpenApiGenerator = new ContractOpenApiGenerator();
  private readonly changelogGenerator = new ChangelogGenerator();

  constructor(
    private readonly registry: VersionRegistry,
    @Inject(OPENAPI_DECORATED_MODULE)
    private readonly openApiDecoratedModule: Type<unknown>,
    @Inject(OPENAPI_OPERATION_TARGET)
    private readonly openApiOperationTarget: OpenApiOperationTarget,
    @Inject(ARTIFACTS_OUTPUT_DIRECTORY)
    private readonly outputDirectory: string,
    @Optional()
    @Inject(FIRST_VERSION_SCHEMA_SEED_CONFIG)
    private readonly firstVersionSchemaSeedConfig?: FirstVersionSchemaSeedConfig,
  ) {}

  async generateArtifacts(): Promise<void> {
    const openApiDirectory = path.join(this.outputDirectory, 'openapi');
    const changelogDirectory = path.join(this.outputDirectory, 'changelog');
    const contractsDirectory = path.join(this.outputDirectory, 'contracts');

    await fs.mkdir(openApiDirectory, { recursive: true });
    await fs.mkdir(changelogDirectory, { recursive: true });
    await fs.mkdir(contractsDirectory, { recursive: true });
    await this.ensureFirstVersionSchemaSeeds(contractsDirectory);

    const existingVersionsByKind =
      await this.readExistingVersionsByKind(contractsDirectory);
    const sharedInput = {
      contractsDirectory,
      supportedVersions: this.registry.supportedVersions,
      compiledVersions: this.registry.compiledVersions,
      toSchemaConstName: (version: ApiVersion, kind: 'request' | 'response') =>
        this.toSchemaConstName(version, kind),
    };

    const [requestResult, responseResult] = await Promise.all([
      this.versionedSchemaGenerator.generateVersionedSchemas({
        ...sharedInput,
        kind: 'request',
        existingVersions: existingVersionsByKind.request,
      }),
      this.versionedSchemaGenerator.generateVersionedSchemas({
        ...sharedInput,
        kind: 'response',
        existingVersions: existingVersionsByKind.response,
      }),
    ]);

    const createdVersions = this.assertMatchingCreatedVersions(
      requestResult,
      responseResult,
    );

    await fs.writeFile(
      path.join(contractsDirectory, 'index.ts'),
      this.buildContractsManifest(this.registry.supportedVersions),
      'utf8',
    );

    const versionsToGenerate = await this.resolveVersionsToGenerateArtifactsFor(
      createdVersions,
      openApiDirectory,
      changelogDirectory,
    );
    if (versionsToGenerate.length === 0) {
      return;
    }

    const baseOpenApiDocument = await this.buildBaseOpenApiDocument();
    const compiledByVersion = new Map<ApiVersion, CompiledVersion>(
      this.registry.compiledVersions.map((version) => [
        version.version,
        version,
      ]),
    );
    const firstVersion = this.registry.supportedVersions[0];

    for (const version of versionsToGenerate) {
      const compiledVersion = compiledByVersion.get(version);
      if (!compiledVersion) {
        throw new Error(
          `Missing compiled version payload for ${version} while generating artifacts.`,
        );
      }

      const requestSchema =
        requestResult.schemasByVersion.get(version) ??
        (version === firstVersion
          ? this.registry.definition.baseRequestSchema
          : undefined);
      const responseSchema =
        responseResult.schemasByVersion.get(version) ??
        (version === firstVersion
          ? this.registry.definition.baseResponseSchema
          : undefined);
      if (!requestSchema || !responseSchema) {
        throw new Error(
          `Missing in-memory schema outputs for version ${version}.`,
        );
      }

      const openApiDocument =
        this.contractOpenApiGenerator.buildVersionOpenApiDocument({
          version,
          baseOpenApiDocument,
          openApiOperationTarget: this.openApiOperationTarget,
          requestSchema,
          responseSchema,
        });

      await fs.writeFile(
        path.join(openApiDirectory, `${version}.json`),
        `${JSON.stringify(openApiDocument, null, 2)}\n`,
        'utf8',
      );

      await fs.writeFile(
        path.join(changelogDirectory, `${version}.md`),
        this.changelogGenerator.buildVersionChangelog(compiledVersion),
        'utf8',
      );
    }
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
      'export const requestSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>(',
      '[',
      requestEntries,
      ']);',
      '',
      'export const responseSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>(',
      '[',
      responseEntries,
      ']);',
      '',
    ].join('\n');
  }

  private async readExistingVersionsByKind(
    contractsDirectory: string,
  ): Promise<{
    request: Set<ApiVersion>;
    response: Set<ApiVersion>;
  }> {
    const entries = await fs.readdir(contractsDirectory, {
      withFileTypes: true,
    });
    const request = new Set<ApiVersion>();
    const response = new Set<ApiVersion>();

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const match = entry.name.match(
        /^(\d{4}-\d{2}-\d{2})\.(request|response)\.schema\.ts$/,
      );
      if (!match) {
        continue;
      }

      const [, version, kind] = match;
      if (kind === 'request') {
        request.add(version as ApiVersion);
      } else {
        response.add(version as ApiVersion);
      }
    }

    return { request, response };
  }

  private async ensureFirstVersionSchemaSeeds(
    contractsDirectory: string,
  ): Promise<void> {
    const firstVersion = this.registry.supportedVersions[0];
    if (!firstVersion) {
      return;
    }

    if (!this.firstVersionSchemaSeedConfig) {
      return;
    }

    await this.ensureFirstVersionSchemaSeedByKind({
      contractsDirectory,
      firstVersion,
      kind: 'request',
      seedImport: this.firstVersionSchemaSeedConfig.request,
    });
    await this.ensureFirstVersionSchemaSeedByKind({
      contractsDirectory,
      firstVersion,
      kind: 'response',
      seedImport: this.firstVersionSchemaSeedConfig.response,
    });
  }

  private async resolveVersionsToGenerateArtifactsFor(
    createdVersions: readonly ApiVersion[],
    openApiDirectory: string,
    changelogDirectory: string,
  ): Promise<readonly ApiVersion[]> {
    const versions = new Set<ApiVersion>(createdVersions);

    const firstVersion = this.registry.supportedVersions[0];
    if (!firstVersion) {
      return [...versions];
    }

    const [hasOpenApi, hasChangelog] = await Promise.all([
      this.hasArtifactFile(openApiDirectory, `${firstVersion}.json`),
      this.hasArtifactFile(changelogDirectory, `${firstVersion}.md`),
    ]);
    if (!hasOpenApi || !hasChangelog) {
      versions.add(firstVersion);
    }

    return this.registry.supportedVersions.filter((version) =>
      versions.has(version),
    );
  }

  private async hasArtifactFile(
    directory: string,
    fileName: string,
  ): Promise<boolean> {
    try {
      await fs.access(path.join(directory, fileName));
      return true;
    } catch {
      return false;
    }
  }

  private async ensureFirstVersionSchemaSeedByKind(input: {
    contractsDirectory: string;
    firstVersion: ApiVersion;
    kind: 'request' | 'response';
    seedImport: { importPath: string; exportName: string };
  }): Promise<void> {
    const filePath = this.schemaFilePath(
      input.contractsDirectory,
      input.firstVersion,
      input.kind,
    );

    try {
      await fs.access(filePath);
      return;
    } catch {
      // File does not exist; seed it below.
    }

    const schemaConstName = this.toSchemaConstName(input.firstVersion, input.kind);
    const seedSource = [
      "import { z } from 'zod';",
      `import { ${input.seedImport.exportName} } from '${input.seedImport.importPath}';`,
      '',
      `export const ${schemaConstName} = ${input.seedImport.exportName};`,
      '',
      `export type ${schemaConstName}Type = z.infer<typeof ${schemaConstName}>;`,
      '',
      `export default ${schemaConstName};`,
      '',
    ].join('\n');

    await fs.writeFile(filePath, seedSource, 'utf8');
  }

  private schemaFilePath(
    contractsDirectory: string,
    version: ApiVersion,
    kind: 'request' | 'response',
  ): string {
    return path.join(contractsDirectory, `${version}.${kind}.schema.ts`);
  }

  private assertMatchingCreatedVersions(
    requestResult: GenerateVersionedSchemasResult,
    responseResult: GenerateVersionedSchemasResult,
  ): readonly ApiVersion[] {
    const requestVersions = requestResult.createdVersions;
    const responseVersions = responseResult.createdVersions;
    if (requestVersions.length !== responseVersions.length) {
      throw new Error(
        'Request and response schema generation produced different created version counts.',
      );
    }

    for (let index = 0; index < requestVersions.length; index += 1) {
      if (requestVersions[index] !== responseVersions[index]) {
        throw new Error(
          `Request and response schema generation disagree on created version at index ${index}.`,
        );
      }
    }

    return requestVersions;
  }
}
