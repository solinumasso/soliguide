import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { RequestOpenApiProjector } from './openapi/request-openapi.projector';
import { RequestSchemaProjector } from './schema/request-schema.projector';
import { ResponseOpenApiProjector } from './openapi/response-openapi.projector';
import { ResponseSchemaProjector } from './schema/response-schema.projector';
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

  beforeEach(async () => {
    generatedDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'public-api-versioning-artifacts-'),
    );
  });

  afterEach(async () => {
    await fs.rm(generatedDirectory, { recursive: true, force: true });
  });

  const buildService = (): ArtifactGenerationService => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );

    const requestOpenApiProjector = new RequestOpenApiProjector(registry);
    const responseOpenApiProjector = new ResponseOpenApiProjector(registry);
    const requestSchemaProjector = new RequestSchemaProjector(registry);
    const responseSchemaProjector = new ResponseSchemaProjector(registry);

    return new ArtifactGenerationService(
      registry,
      requestOpenApiProjector,
      responseOpenApiProjector,
      requestSchemaProjector,
      responseSchemaProjector,
      CatalogFixtureModule,
      catalogOpenApiOperationTarget,
      generatedDirectory,
    );
  };

  it('generates openapi, changelog and contract files per version', async () => {
    const artifactGenerationService = buildService();

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

    const parsedOpenApiOld = JSON.parse(openApiOld) as Record<string, unknown>;
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

    expect(readQueryParameterNames(parsedOpenApiOld)).toContain('openToday');
    expect(readQueryParameterNames(parsedOpenApiCanonical)).toContain(
      'isOpenToday',
    );

    expect(changelogCanonical).toContain(
      'Renamed response field slug to seoUrl',
    );
    expect(requestContract).toContain('z.coerce.boolean().optional()');
    expect(contractManifest).toContain('type ApiVersion =');
    expect(contractManifest).toContain('requestSchemasByVersion');
    expect(contractManifest).toContain('responseSchemasByVersion');
  });

  it('overwrites generated files deterministically', async () => {
    const artifactGenerationService = buildService();

    await artifactGenerationService.generateArtifacts();

    const openApiPath = path.join(
      generatedDirectory,
      'openapi',
      '2026-03-09.json',
    );
    const initialContent = await fs.readFile(openApiPath, 'utf8');

    await fs.writeFile(openApiPath, '{"mutated":true}\n', 'utf8');

    await artifactGenerationService.generateArtifacts();

    const regeneratedContent = await fs.readFile(openApiPath, 'utf8');

    expect(regeneratedContent).toBe(initialContent);
  });
});
