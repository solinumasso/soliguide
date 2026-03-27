import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
  catalogOpenApiOperationTarget,
  catalogVersioningDefinition,
  CatalogFixtureModule,
} from '../testing';
import { DslCompiler } from '../versioning/dsl-compiler';
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
    );
  };

  it('generates openapi, changelog and contract files per version', async () => {
    const artifactGenerationService = buildService();
    await seedFirstVersionContracts(generatedDirectory);
    const existingOpenApiPath = path.join(
      generatedDirectory,
      'openapi',
      '2026-03-03.json',
    );
    const existingChangelogPath = path.join(
      generatedDirectory,
      'changelog',
      '2026-03-03.md',
    );
    await fs.mkdir(path.dirname(existingOpenApiPath), { recursive: true });
    await fs.mkdir(path.dirname(existingChangelogPath), { recursive: true });
    await fs.writeFile(
      existingOpenApiPath,
      '{\n  "preExisting": true\n}\n',
      'utf8',
    );
    await fs.writeFile(existingChangelogPath, '# Existing changelog\n', 'utf8');

    await artifactGenerationService.generateArtifacts();

    const paths = {
      openApiOld: path.join(generatedDirectory, 'openapi', '2026-03-03.json'),
      openApiCanonical: path.join(
        generatedDirectory,
        'openapi',
        '2026-03-09.json',
      ),
      changelogOld: path.join(generatedDirectory, 'changelog', '2026-03-03.md'),
      changelogCanonical: path.join(
        generatedDirectory,
        'changelog',
        '2026-03-09.md',
      ),
      requestContract: path.join(
        generatedDirectory,
        'contracts',
        '2026-03-09.request.schema.ts',
      ),
      responseContract: path.join(
        generatedDirectory,
        'contracts',
        '2026-03-09.response.schema.ts',
      ),
      contractManifest: path.join(generatedDirectory, 'contracts', 'index.ts'),
    };

    await Promise.all(
      Object.values(paths).map(async (filePath) => fs.access(filePath)),
    );

    const [
      openApiOld,
      openApiCanonical,
      changelogCanonical,
      requestContract,
      contractManifest,
    ] = await Promise.all([
      fs.readFile(paths.openApiOld, 'utf8'),
      fs.readFile(paths.openApiCanonical, 'utf8'),
      fs.readFile(paths.changelogCanonical, 'utf8'),
      fs.readFile(paths.requestContract, 'utf8'),
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

    expect(readQueryParameterNames(parsedOpenApiCanonical)).toContain('isOpenToday');

    const canonicalResponseSchema = ((((((
      parsedOpenApiCanonical.paths as Record<string, unknown>
    )['/catalog'] as Record<string, unknown>).get as Record<string, unknown>)
      .responses as Record<string, unknown>)['200'] as Record<string, unknown>)
      .content as Record<string, unknown>)['application/json'] as Record<
      string,
      unknown
    >;
    const canonicalNameSchema = (((((canonicalResponseSchema
      .schema as Record<string, unknown>).properties as Record<string, unknown>)
      .results as Record<string, unknown>).items as Record<string, unknown>)
      .properties as Record<string, unknown>).name as Record<string, unknown>;
    expect(canonicalNameSchema.type).toBe('object');

    expect(changelogCanonical).toContain(
      'Renamed response field slug to seoUrl',
    );
    expect(requestContract).toContain('z.coerce.boolean().optional()');
    expect(contractManifest).toContain('type ApiVersion =');
    expect(contractManifest).toContain('requestSchemasByVersion');
    expect(contractManifest).toContain('responseSchemasByVersion');
    expect(openApiOld.trim()).toBe('{\n  "preExisting": true\n}'.trim());
    expect(
      await fs.readFile(paths.changelogOld, 'utf8'),
    ).toBe('# Existing changelog\n');
  });

  it('does not regenerate openapi and changelog when no new contract version is created', async () => {
    const artifactGenerationService = buildService();
    await seedFirstVersionContracts(generatedDirectory);

    await artifactGenerationService.generateArtifacts();

    const openApiPath = path.join(
      generatedDirectory,
      'openapi',
      '2026-03-09.json',
    );
    const changelogPath = path.join(
      generatedDirectory,
      'changelog',
      '2026-03-09.md',
    );
    const initialOpenApi = await fs.readFile(openApiPath, 'utf8');
    const initialChangelog = await fs.readFile(changelogPath, 'utf8');

    await artifactGenerationService.generateArtifacts();

    const nextOpenApi = await fs.readFile(openApiPath, 'utf8');
    const nextChangelog = await fs.readFile(changelogPath, 'utf8');
    expect(nextOpenApi).toBe(initialOpenApi);
    expect(nextChangelog).toBe(initialChangelog);
  });
});

async function seedFirstVersionContracts(outputDirectory: string): Promise<void> {
  const contractsDirectory = path.join(outputDirectory, 'contracts');
  await fs.mkdir(contractsDirectory, { recursive: true });

  await fs.writeFile(
    path.join(contractsDirectory, '2026-03-03.request.schema.ts'),
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
    path.join(contractsDirectory, '2026-03-03.response.schema.ts'),
    [
      "import { z } from 'zod';",
      '',
      'export const v20260303ResponseSchema = z.object({',
      '  _links: z.object({',
      '    self: z.object({',
      '      href: z.string(),',
      '    }).strict(),',
      '    next: z.object({',
      '      href: z.string(),',
      '    }).strict(),',
      '    prev: z.object({',
      '      href: z.string(),',
      '    }).strict(),',
      '  }).strict(),',
      '  results: z.array(z.object({',
      '    id: z.string(),',
      '    slug: z.string(),',
      '    name: z.string(),',
      '    summary: z.string(),',
      '    type: z.enum([\"book\", \"guide\"]),',
      '    isOpenToday: z.boolean(),',
      '    languages: z.array(z.string()),',
      '  }).strict()),',
      '  page: z.object({',
      '    current: z.number().int().min(1),',
      '    limit: z.number().int().min(1),',
      '    totalPages: z.number().int().min(1),',
      '    totalResults: z.number().int().min(0),',
      '  }).strict(),',
      '}).strict();',
      '',
      'export type v20260303ResponseSchemaType = z.infer<typeof v20260303ResponseSchema>;',
      '',
      'export default v20260303ResponseSchema;',
      '',
    ].join('\n'),
    'utf8',
  );
}
