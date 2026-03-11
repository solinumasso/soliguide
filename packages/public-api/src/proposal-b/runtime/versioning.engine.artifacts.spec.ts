import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { DslCompiler } from '../versioning/dsl-compiler';
import {
  requestSchemasByVersion,
  responseSchemasByVersion,
} from '../generated/contracts';
import { RequestOpenApiProjector } from '../projection/openapi/request-openapi.projector';
import { RequestSchemaProjector } from '../projection/schema/request-schema.projector';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseOpenApiProjector } from '../projection/openapi/response-openapi.projector';
import { ResponseSchemaProjector } from '../projection/schema/response-schema.projector';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import {
  searchOpenApiOperationTarget,
  searchVersioningDefinition,
} from '../app/search';
import { VersioningEngine } from './versioning.engine';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';

describe('ProposalC VersioningEngine artifacts generation', () => {
  const generatedDirectory = path.resolve(__dirname, '..', 'generated');

  const buildEngine = (): VersioningEngine => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();

    const requestOpenApiProjector = new RequestOpenApiProjector(registry);
    const responseOpenApiProjector = new ResponseOpenApiProjector(registry);
    const requestSchemaProjector = new RequestSchemaProjector(registry);
    const responseSchemaProjector = new ResponseSchemaProjector(registry);

    const requestPipeline = new RequestVersioningPipeline(
      registry,
      resolver,
      requestSchemasByVersion,
    );
    const responsePipeline = new ResponseVersioningPipeline(registry, resolver);

    return new VersioningEngine(
      registry,
      resolver,
      requestPipeline,
      responsePipeline,
      requestOpenApiProjector,
      responseOpenApiProjector,
      requestSchemaProjector,
      responseSchemaProjector,
      searchOpenApiOperationTarget,
      requestSchemasByVersion,
      responseSchemasByVersion,
    );
  };

  it('generates openapi, changelog and contract files per version', async () => {
    const engine = buildEngine();

    await engine.generateArtifacts();

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
      const searchPath = pathsNode['/search'] as Record<string, unknown>;
      const getOperation = searchPath.get as Record<string, unknown>;
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
    expect(contractManifest).toContain('requestSchemasByVersion');
    expect(contractManifest).toContain('responseSchemasByVersion');
  });

  it('overwrites generated files deterministically', async () => {
    const engine = buildEngine();

    await engine.generateArtifacts();

    const openApiPath = path.join(
      generatedDirectory,
      'openapi',
      '2026-03-09.json',
    );
    const initialContent = await fs.readFile(openApiPath, 'utf8');

    await fs.writeFile(openApiPath, '{"mutated":true}\n', 'utf8');

    await engine.generateArtifacts();

    const regeneratedContent = await fs.readFile(openApiPath, 'utf8');

    expect(regeneratedContent).toBe(initialContent);
  });
});
