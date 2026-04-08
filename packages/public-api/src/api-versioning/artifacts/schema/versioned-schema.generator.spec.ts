import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { VersionedSchemaGenerator } from './versioned-schema.generator';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { VersionedSchemaGeneratorConfig } from './project.factory';

function resolvePackagePath(relativePath: string): string {
  const fromCurrentDirectory = path.resolve(process.cwd(), relativePath);

  if (existsSync(fromCurrentDirectory)) {
    return fromCurrentDirectory;
  }

  const fromWorkspaceRoot = path.resolve(
    process.cwd(),
    'packages/public-api',
    relativePath,
  );

  if (existsSync(fromWorkspaceRoot)) {
    return fromWorkspaceRoot;
  }

  throw new Error(`Could not resolve path: ${relativePath}`);
}

describe('VersionedSchemaGenerator', () => {
  let tempDirectory = '';

  beforeEach(async () => {
    tempDirectory = await mkdtemp(
      path.join(os.tmpdir(), 'versioned-schema-ast-'),
    );
  });

  afterEach(async () => {
    await rm(tempDirectory, { recursive: true, force: true });
  });

  async function generateOnce(
    config: VersionedSchemaGeneratorConfig,
  ): Promise<string> {
    const generator = new VersionedSchemaGenerator(config);
    await generator.generate();
    return readFile(path.resolve(process.cwd(), config.outputPath), 'utf8');
  }

  it('applies ordered response changes and generates expected schema', async () => {
    const outputPath = path.join(
      tempDirectory,
      '2026-03-03.search.response.generated.ts',
    );

    const generated = await generateOnce({
      kind: 'response',
      baseSchemaPath: resolvePackagePath(
        'src/app/api/schema/2026-01-01/search.response/2026-01-01.search.response.ts',
      ),
      versionDefinitionPath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/20260303.version.ts',
      ),
      changesSourcePath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/search.response/2026-03-03.search.response.ts',
      ),
      outputPath,
      inputSchemaConstName: 'v20260101SearchResponseSchema',
      outputSchemaConstName: 'v20260303SearchResponseSchema',
      outputPayloadTypeName: 'V20260303SearchResponse',
      outputSchemaTypeName: 'v20260303SearchResponseSchemaType',
    });

    expect(generated).toContain('array(placeTypeDiscriminatedSchema)');
    expect(generated).not.toContain('services_all');
    expect(generated).not.toContain('seo_url');
    expect(generated).not.toContain('legacyServiceSchema');
    expect(generated).not.toContain("from './location'");
    expect(generated).toContain('const locationSchema = z');
  });

  it('reads requestChanges in request mode', async () => {
    await writeFile(
      path.join(tempDirectory, 'request-base.ts'),
      [
        "import { z } from 'zod';",
        '',
        'export const baseRequestSchema = z.object({',
        '  qOld: z.string().optional(),',
        '});',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      path.join(tempDirectory, 'request-version.ts'),
      [
        'class RequestVersionProvider {',
        '  toVersion() {',
        '    return {',
        '      requestChanges: [new RenameQuery()],',
        '      responseChanges: [],',
        '    };',
        '  }',
        '}',
        '',
        'export const provider = new RequestVersionProvider();',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      path.join(tempDirectory, 'request-changes.ts'),
      [
        "import { z } from 'zod';",
        '',
        'class RenameFieldChange {}',
        '',
        'export class RenameQuery extends RenameFieldChange {',
        "  payloadPath = '/' as const;",
        "  from = 'qOld';",
        "  to = 'q';",
        '  schema = z.string().min(1).optional();',
        '}',
      ].join('\n'),
      'utf8',
    );

    const outputPath = path.join(tempDirectory, 'request.generated.ts');
    const generated = await generateOnce({
      kind: 'request',
      baseSchemaPath: path.join(tempDirectory, 'request-base.ts'),
      versionDefinitionPath: path.join(tempDirectory, 'request-version.ts'),
      changesSourcePath: path.join(tempDirectory, 'request-changes.ts'),
      outputPath,
      inputSchemaConstName: 'baseRequestSchema',
      outputSchemaConstName: 'vXRequestSchema',
      outputPayloadTypeName: 'VXRequest',
      outputSchemaTypeName: 'vXRequestSchemaType',
    });

    expect(generated).toContain('q: z.string().min(1).optional()');
    expect(generated).not.toContain('qOld');
  });

  it('emits export names exactly as configured', async () => {
    const outputPath = path.join(
      tempDirectory,
      'response.custom-exports.generated.ts',
    );

    const generated = await generateOnce({
      kind: 'response',
      baseSchemaPath: resolvePackagePath(
        'src/app/api/schema/2026-01-01/search.response/2026-01-01.search.response.ts',
      ),
      versionDefinitionPath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/20260303.version.ts',
      ),
      changesSourcePath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/search.response/2026-03-03.search.response.ts',
      ),
      outputPath,
      inputSchemaConstName: 'v20260101SearchResponseSchema',
      outputSchemaConstName: 'customSchemaName',
      outputPayloadTypeName: 'CustomPayloadType',
      outputSchemaTypeName: 'CustomSchemaType',
    });

    expect(generated).toContain('export const customSchemaName = z');
    expect(generated).toContain(
      'export type CustomPayloadType = z.infer<typeof customSchemaName>',
    );
    expect(generated).toContain(
      'export type CustomSchemaType = z.infer<typeof customSchemaName>',
    );
    expect(generated).toContain('export default customSchemaName;');
  });

  it('fails with actionable error when payload path is invalid', async () => {
    await writeFile(
      path.join(tempDirectory, 'invalid-base.ts'),
      [
        "import { z } from 'zod';",
        '',
        'export const baseSchema = z.object({',
        '  root: z.object({ value: z.string().optional() }),',
        '});',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      path.join(tempDirectory, 'invalid-version.ts'),
      [
        'class InvalidVersionProvider {',
        '  toVersion() {',
        '    return {',
        '      requestChanges: [],',
        '      responseChanges: [new RemoveMissingField()],',
        '    };',
        '  }',
        '}',
      ].join('\n'),
      'utf8',
    );
    await writeFile(
      path.join(tempDirectory, 'invalid-changes.ts'),
      [
        'class RemoveFieldChange {}',
        '',
        'export class RemoveMissingField extends RemoveFieldChange {',
        "  payloadPath = '/root/missing' as const;",
        "  field = 'ghost';",
        '}',
      ].join('\n'),
      'utf8',
    );

    const generator = new VersionedSchemaGenerator({
      kind: 'response',
      baseSchemaPath: path.join(tempDirectory, 'invalid-base.ts'),
      versionDefinitionPath: path.join(tempDirectory, 'invalid-version.ts'),
      changesSourcePath: path.join(tempDirectory, 'invalid-changes.ts'),
      outputPath: path.join(tempDirectory, 'invalid.generated.ts'),
      inputSchemaConstName: 'baseSchema',
      outputSchemaConstName: 'vInvalidSchema',
      outputPayloadTypeName: 'VInvalid',
      outputSchemaTypeName: 'vInvalidSchemaType',
    });

    await expect(generator.generate()).rejects.toThrow(
      '[RemoveMissingField] Cannot resolve payloadPath "/root/missing"',
    );
  });

  it('is deterministic and prettier-formatted', async () => {
    const outputPath = path.join(tempDirectory, 'deterministic.generated.ts');

    const config: VersionedSchemaGeneratorConfig = {
      kind: 'response',
      baseSchemaPath: resolvePackagePath(
        'src/app/api/schema/2026-01-01/search.response/2026-01-01.search.response.ts',
      ),
      versionDefinitionPath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/20260303.version.ts',
      ),
      changesSourcePath: resolvePackagePath(
        'src/app/api/schema/2026-03-03/search.response/2026-03-03.search.response.ts',
      ),
      outputPath,
      inputSchemaConstName: 'v20260101SearchResponseSchema',
      outputSchemaConstName: 'v20260303SearchResponseSchema',
      outputPayloadTypeName: 'V20260303SearchResponse',
      outputSchemaTypeName: 'v20260303SearchResponseSchemaType',
    };

    const first = await generateOnce(config);
    const second = await generateOnce(config);

    expect(second).toBe(first);

    const prettierConfig = (await resolveConfig(outputPath)) ?? {};
    const formatted = await format(first, {
      ...prettierConfig,
      parser: 'typescript',
    });
    const withTrailingNewline = formatted.endsWith('\n')
      ? formatted
      : `${formatted}\n`;

    expect(first).toBe(withTrailingNewline);
  });
});
