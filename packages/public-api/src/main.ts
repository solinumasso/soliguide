/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import type { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { INestApplication } from '@nestjs/common';
import { SearchModule } from './app/search.module';
import { VersionRegistry } from './api-versioning/versioning';

type OpenApiDocument = Record<string, unknown>;
type VersionedOpenApiDocuments = ReadonlyMap<string, OpenApiDocument>;

function getCanonicalVersion(versions: readonly string[]): string {
  if (versions.length === 0) {
    throw new Error('No search API versions configured for OpenAPI docs.');
  }

  return versions[versions.length - 1];
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveSchemaArtifactsDirectory(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), 'src/app/api/schema'),
    path.resolve(__dirname, 'app/api/schema'),
    path.resolve(__dirname, '../../src/app/api/schema'),
  ];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Missing search API schema artifacts directory. Checked: ${candidates.join(
      ', ',
    )}. Run "yarn --cwd packages/public-api generate:search-api:artifacts".`,
  );
}

async function loadVersionedOpenApiDocuments(
  versions: readonly string[],
): Promise<VersionedOpenApiDocuments> {
  const directory = await resolveSchemaArtifactsDirectory();
  const documentsByVersion = new Map<string, OpenApiDocument>();

  for (const version of versions) {
    const filePath = path.join(
      directory,
      version,
      `${version}.openapi.generated.json`,
    );
    let rawContent: string;

    try {
      rawContent = await fs.readFile(filePath, 'utf8');
    } catch {
      throw new Error(
        `Missing search API OpenAPI artifact for version ${version} at "${filePath}". Run "yarn --cwd packages/public-api generate:search-api:artifacts".`,
      );
    }

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(rawContent) as unknown;
    } catch {
      throw new Error(
        `Invalid JSON in search API OpenAPI artifact "${filePath}". Regenerate artifacts with "yarn --cwd packages/public-api generate:search-api:artifacts".`,
      );
    }

    if (!parsedContent || typeof parsedContent !== 'object') {
      throw new Error(
        `Invalid OpenAPI artifact "${filePath}": expected a JSON object document.`,
      );
    }

    documentsByVersion.set(version, parsedContent as OpenApiDocument);
  }

  return documentsByVersion;
}

function buildScalarSources(
  versions: readonly string[],
  canonicalVersion: string,
): Array<{
  title: string;
  url: string;
  default: boolean;
}> {
  return versions.map((version) => ({
    title: `Search API ${version}`,
    url: `/swagger/json/${version}`,
    default: version === canonicalVersion,
  }));
}

function registerVersionedOpenApiRoutes(
  app: INestApplication,
  documentsByVersion: VersionedOpenApiDocuments,
  canonicalVersion: string,
): void {
  const appInstance = app.getHttpAdapter().getInstance();

  appInstance.get('/swagger/json', (_req: Request, res: Response) => {
    const canonicalDocument = documentsByVersion.get(canonicalVersion);
    if (!canonicalDocument) {
      res.status(500).json({
        message: `Missing canonical OpenAPI document ${canonicalVersion}.`,
      });
      return;
    }

    res.json(canonicalDocument);
  });

  appInstance.get('/swagger/json/:version', (req: Request, res: Response) => {
    const requestedVersion = Array.isArray(req.params.version)
      ? req.params.version[0]
      : req.params.version;
    const document = documentsByVersion.get(requestedVersion);

    if (!document) {
      res.status(404).json({
        message: `Unsupported OpenAPI version "${requestedVersion}".`,
      });
      return;
    }

    res.json(document);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  const registry = app.get(VersionRegistry);
  const supportedVersions = [...registry.supportedVersions];
  const canonicalVersion = getCanonicalVersion(supportedVersions);
  const documentsByVersion =
    await loadVersionedOpenApiDocuments(supportedVersions);

  registerVersionedOpenApiRoutes(app, documentsByVersion, canonicalVersion);
  app.use(
    '/api/docs',
    apiReference({
      sources: buildScalarSources(supportedVersions, canonicalVersion),
      orderSchemaPropertiesBy: 'preserve',
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
