import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
  catalogOpenApiOperationTarget,
  catalogVersioningDefinition,
  CatalogFixtureModule,
} from '../testing';
import { DslCompiler } from '../versioning/dsl/dsl-compiler';
import { VersionRegistry } from '../versioning/version-registry';
import { ArtifactGenerationService } from './artifact.generator';

describe('ProposalC ArtifactGenerationService', () => {
  let generatedDirectory = '';
  let sandboxRoot = '';

  beforeEach(async () => {
    sandboxRoot = path.join(
      process.cwd(),
      '.tmp-public-api-versioning-artifacts',
    );
    await fs.mkdir(sandboxRoot, { recursive: true });
    generatedDirectory = await fs.mkdtemp(path.join(sandboxRoot, 'run-'));
  });

  afterEach(async () => {
    await fs.rm(generatedDirectory, { recursive: true, force: true });
    await fs.rm(sandboxRoot, { recursive: true, force: true });
  });

  const buildService = (): ArtifactGenerationService => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );

    return new ArtifactGenerationService(
      registry,
      CatalogFixtureModule,
      catalogOpenApiOperationTarget,
      generatedDirectory,
      {
        request: {
          importPath: './2026-03-03.catalog.request',
          exportName: 'v20260303RequestSchema',
        },
        response: {
          importPath: './2026-03-03.catalog.response',
          exportName: 'v20260303ResponseSchema',
        },
      },
    );
  };

  it('generates standalone contracts, openapi and changelog artifacts for all versions', async () => {
    const artifactGenerationService = buildService();
    await seedFirstVersionSources(generatedDirectory);

    await artifactGenerationService.generateArtifacts();

    const paths = {
      openApiFirst: path.join(
        generatedDirectory,
        '2026-03-03',
        '2026-03-03.openapi.generated.json',
      ),
      openApiCanonical: path.join(
        generatedDirectory,
        '2026-03-09',
        '2026-03-09.openapi.generated.json',
      ),
      changelogFirst: path.join(
        generatedDirectory,
        '2026-03-03',
        '2026-03-03.changelog.generated.md',
      ),
      changelogCanonical: path.join(
        generatedDirectory,
        '2026-03-09',
        '2026-03-09.changelog.generated.md',
      ),
      requestFirst: path.join(
        generatedDirectory,
        '2026-03-03',
        'catalog.request',
        '2026-03-03.catalog.request.generated.ts',
      ),
      responseFirst: path.join(
        generatedDirectory,
        '2026-03-03',
        'catalog.response',
        '2026-03-03.catalog.response.generated.ts',
      ),
      requestCanonical: path.join(
        generatedDirectory,
        '2026-03-09',
        'catalog.request',
        '2026-03-09.catalog.request.generated.ts',
      ),
      responseCanonical: path.join(
        generatedDirectory,
        '2026-03-09',
        'catalog.response',
        '2026-03-09.catalog.response.generated.ts',
      ),
      contractManifest: path.join(generatedDirectory, 'contracts.generated.ts'),
    };

    await Promise.all(
      Object.values(paths).map(async (filePath) => fs.access(filePath)),
    );

    const [
      openApiCanonical,
      changelogFirst,
      changelogCanonical,
      requestFirst,
      responseFirst,
      requestCanonical,
      responseCanonical,
      contractManifest,
    ] = await Promise.all([
      fs.readFile(paths.openApiCanonical, 'utf8'),
      fs.readFile(paths.changelogFirst, 'utf8'),
      fs.readFile(paths.changelogCanonical, 'utf8'),
      fs.readFile(paths.requestFirst, 'utf8'),
      fs.readFile(paths.responseFirst, 'utf8'),
      fs.readFile(paths.requestCanonical, 'utf8'),
      fs.readFile(paths.responseCanonical, 'utf8'),
      fs.readFile(paths.contractManifest, 'utf8'),
    ]);

    const parsedOpenApiCanonical = JSON.parse(openApiCanonical) as Record<
      string,
      unknown
    >;

    const readQueryParameterNames = (document: Record<string, unknown>) => {
      const pathsNode = document.paths as Record<string, unknown>;
      const catalogPath = pathsNode['/catalog'] as Record<string, unknown>;
      const getOperation = catalogPath.get as Record<string, unknown>;
      const parameters = getOperation.parameters as Array<
        Record<string, unknown>
      >;

      return parameters.map((parameter) => parameter.name);
    };

    expect(readQueryParameterNames(parsedOpenApiCanonical)).toContain(
      'isOpenToday',
    );

    const canonicalResponseSchema = (
      (
        (
          (
            (parsedOpenApiCanonical.paths as Record<string, unknown>)[
              '/catalog'
            ] as Record<string, unknown>
          ).get as Record<string, unknown>
        ).responses as Record<string, unknown>
      )['200'] as Record<string, unknown>
    ).content as Record<string, unknown>;
    const canonicalNameSchema = (
      (
        (
          (
            (
              canonicalResponseSchema['application/json'] as Record<
                string,
                unknown
              >
            ).schema as Record<string, unknown>
          ).properties as Record<string, unknown>
        ).results as Record<string, unknown>
      ).items as Record<string, unknown>
    ).properties as Record<string, unknown>;

    expect((canonicalNameSchema.name as Record<string, unknown>).type).toBe(
      'object',
    );

    expect(changelogFirst).toContain('DO NOT EDIT');
    expect(changelogCanonical).toContain(
      'Renamed response field slug to seoUrl',
    );
    expect(changelogCanonical).toContain('DO NOT EDIT');

    expect(requestFirst).toContain('DO NOT EDIT');
    expect(requestCanonical).toContain(
      'isOpenToday: z.coerce.boolean().optional()',
    );
    expect(responseFirst).toContain('const catalogItemSchema');
    expect(responseCanonical).toContain('seoUrl: z.string()');

    expect(hasRelativeImport(requestFirst)).toBe(false);
    expect(hasRelativeImport(responseFirst)).toBe(false);
    expect(hasRelativeImport(requestCanonical)).toBe(false);
    expect(hasRelativeImport(responseCanonical)).toBe(false);

    expect(contractManifest).toContain('type ApiVersion =');
    expect(contractManifest).toContain('requestSchemasByVersion');
    expect(contractManifest).toContain('responseSchemasByVersion');
    expect(contractManifest).toContain('DO NOT EDIT');
    expect(parsedOpenApiCanonical['x-generated-file-warning']).toContain(
      'DO NOT EDIT',
    );
  });

  it('produces deterministic content on repeated generation', async () => {
    const artifactGenerationService = buildService();
    await seedFirstVersionSources(generatedDirectory);

    await artifactGenerationService.generateArtifacts();

    const openApiPath = path.join(
      generatedDirectory,
      '2026-03-09',
      '2026-03-09.openapi.generated.json',
    );
    const changelogPath = path.join(
      generatedDirectory,
      '2026-03-09',
      '2026-03-09.changelog.generated.md',
    );
    const responsePath = path.join(
      generatedDirectory,
      '2026-03-09',
      'catalog.response',
      '2026-03-09.catalog.response.generated.ts',
    );

    const initialOpenApi = await fs.readFile(openApiPath, 'utf8');
    const initialChangelog = await fs.readFile(changelogPath, 'utf8');
    const initialResponse = await fs.readFile(responsePath, 'utf8');

    await artifactGenerationService.generateArtifacts();

    const nextOpenApi = await fs.readFile(openApiPath, 'utf8');
    const nextChangelog = await fs.readFile(changelogPath, 'utf8');
    const nextResponse = await fs.readFile(responsePath, 'utf8');

    expect(nextOpenApi).toBe(initialOpenApi);
    expect(nextChangelog).toBe(initialChangelog);
    expect(nextResponse).toBe(initialResponse);
  }, 20000);
});

function hasRelativeImport(sourceText: string): boolean {
  return /from\s+['"]\.\.?\//.test(sourceText);
}

async function seedFirstVersionSources(outputDirectory: string): Promise<void> {
  const requestDirectory = path.join(
    outputDirectory,
    '2026-03-03',
    'catalog.request',
  );
  const responseDirectory = path.join(
    outputDirectory,
    '2026-03-03',
    'catalog.response',
  );
  const requestDirectoryV2 = path.join(
    outputDirectory,
    '2026-03-09',
    'catalog.request',
  );
  const responseDirectoryV2 = path.join(
    outputDirectory,
    '2026-03-09',
    'catalog.response',
  );
  await fs.mkdir(requestDirectory, { recursive: true });
  await fs.mkdir(responseDirectory, { recursive: true });
  await fs.mkdir(requestDirectoryV2, { recursive: true });
  await fs.mkdir(responseDirectoryV2, { recursive: true });

  await fs.writeFile(
    path.join(requestDirectory, '2026-03-03.catalog.request.ts'),
    [
      "import { z } from 'zod';",
      '',
      'export const v20260303RequestSchema = z.object({',
      '  page: z.coerce.number().int().min(1).optional(),',
      '  limit: z.coerce.number().int().min(1).max(100).optional(),',
      '  openToday: z.coerce.boolean().optional(),',
      '}).strict();',
      '',
      'export type v20260303RequestSchemaType = z.infer<typeof v20260303RequestSchema>;',
      '',
      'export default v20260303RequestSchema;',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(responseDirectory, '2026-03-03.catalog.response.ts'),
    [
      "import { z } from 'zod';",
      '',
      'const catalogItemSchema = z',
      '  .object({',
      '    id: z.string(),',
      '    slug: z.string(),',
      '    name: z.string(),',
      '    summary: z.string(),',
      "    type: z.enum(['book', 'guide']),",
      '    isOpenToday: z.boolean(),',
      '    languages: z.array(z.string()),',
      '  })',
      '  .strict();',
      '',
      'const linksSchema = z',
      '  .object({',
      '    self: z.object({ href: z.string() }).strict(),',
      '    next: z.object({ href: z.string() }).strict(),',
      '    prev: z.object({ href: z.string() }).strict(),',
      '  })',
      '  .strict();',
      '',
      'export const v20260303ResponseSchema = z.object({',
      '  _links: linksSchema,',
      '  results: z.array(catalogItemSchema),',
      '  page: z',
      '    .object({',
      '      current: z.number().int().min(1),',
      '      limit: z.number().int().min(1),',
      '      totalPages: z.number().int().min(1),',
      '      totalResults: z.number().int().min(0),',
      '    })',
      '    .strict(),',
      '}).strict();',
      '',
      'export type v20260303ResponseSchemaType = z.infer<typeof v20260303ResponseSchema>;',
      '',
      'export default v20260303ResponseSchema;',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(outputDirectory, '2026-03-03', '20260303.version.ts'),
    [
      'class Version20260303Provider {',
      '  toVersion() {',
      '    return {',
      '      requestChanges: [],',
      '      responseChanges: [],',
      '    };',
      '  }',
      '}',
      '',
      'export const version20260303 = new Version20260303Provider().toVersion();',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(outputDirectory, '2026-03-09', '20260309.version.ts'),
    [
      'class Version20260309Provider {',
      '  toVersion() {',
      '    return {',
      '      requestChanges: [new RenameRequestOpenToday()],',
      '      responseChanges: [new RenameResponseSlug(), new ExpandResponseName()],',
      '    };',
      '  }',
      '}',
      '',
      'export const version20260309 = new Version20260309Provider().toVersion();',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(requestDirectoryV2, '2026-03-09.catalog.request.ts'),
    [
      "import { z } from 'zod';",
      '',
      'class RenameFieldChange {}',
      '',
      'export class RenameRequestOpenToday extends RenameFieldChange {',
      "  payloadPath = '/' as const;",
      "  from = 'openToday';",
      "  to = 'isOpenToday';",
      '  schema = z.coerce.boolean().optional();',
      '}',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(responseDirectoryV2, '2026-03-09.catalog.response.ts'),
    [
      "import { z } from 'zod';",
      '',
      'class RenameFieldChange {}',
      'class ReplaceFieldChange {}',
      '',
      'export class RenameResponseSlug extends RenameFieldChange {',
      "  payloadPath = '/results/*' as const;",
      "  from = 'slug';",
      "  to = 'seoUrl';",
      '  schema = z.string();',
      '}',
      '',
      'export class ExpandResponseName extends ReplaceFieldChange {',
      "  payloadPath = '/results/*' as const;",
      "  field = 'name';",
      '  schema = z',
      '    .object({',
      '      originalName: z.string(),',
      '      translatedName: z.string(),',
      '    })',
      '    .strict();',
      '}',
      '',
    ].join('\n'),
    'utf8',
  );
}
