import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { z } from 'zod';
import { VersionedSchemaGenerator } from './versioned-schema.generator';
import { annotateZodSchemaExpression } from '../../versioning/zod-schema-expression.utils';
import type { CompiledVersion } from '../../versioning/versioning.types';

const versions = ['2026-03-03', '2026-03-09'] as const;

const compiledVersions: readonly CompiledVersion[] = [
  {
    version: '2026-03-03',
    description: 'Initial',
    requestChanges: [],
    responseChanges: [],
  },
  {
    version: '2026-03-09',
    description: 'Renames fields',
    requestChanges: [
      {
        description: 'Rename openToday to isOpenToday',
        schemaPatch: {
          payloadPath: '/',
          remove: ['openToday'],
          set: {
            isOpenToday: {
              zod: annotateZodSchemaExpression(
                z.coerce.boolean().optional(),
                'z.coerce.boolean().optional()',
              ),
            },
          },
        },
        upgrade: (payload) => payload,
      },
    ],
    responseChanges: [
      {
        description: 'Rename slug to seoUrl',
        schemaPatch: {
          payloadPath: '/results/*',
          remove: ['slug'],
          set: {
            seoUrl: {
              zod: annotateZodSchemaExpression(z.string(), 'z.string()'),
            },
            name: {
              zod: annotateZodSchemaExpression(
                z
                  .object({
                    originalName: z.string(),
                    translatedName: z.string(),
                  })
                  .strict(),
                'z.object({ originalName: z.string(), translatedName: z.string() }).strict()',
              ),
            },
          },
        },
        downgrade: (payload) => payload,
      },
    ],
  },
];

function schemaFilePathForVersion(
  outputDirectory: string,
  version: `${number}-${number}-${number}`,
  kind: 'request' | 'response',
): string {
  return path.join(
    outputDirectory,
    version,
    `search.${kind}`,
    `${version}.search.${kind}.generated.ts`,
  );
}

function hasRelativeImport(sourceText: string): boolean {
  return /from\s+['"]\.\.?\//.test(sourceText);
}

describe('VersionedSchemaGenerator', () => {
  let outputDirectory = '';

  beforeEach(async () => {
    outputDirectory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'public-api-schema-generator-'),
    );
  });

  afterEach(async () => {
    await fs.rm(outputDirectory, { recursive: true, force: true });
  });

  it('regenerates all versions from standalone seed sources', async () => {
    const firstVersionSeeds = await seedVersion20260303Sources(outputDirectory);
    const generator = new VersionedSchemaGenerator();

    const requestResult = await generator.generateVersionedSchemas({
      supportedVersions: versions,
      compiledVersions,
      kind: 'request',
      firstVersionSeed: {
        sourceFilePath: firstVersionSeeds.requestSourcePath,
        exportName: 'v20260303RequestSchema',
      },
      toSchemaConstName,
      schemaFilePathForVersion: (version, kind) =>
        schemaFilePathForVersion(outputDirectory, version, kind),
    });

    const responseResult = await generator.generateVersionedSchemas({
      supportedVersions: versions,
      compiledVersions,
      kind: 'response',
      firstVersionSeed: {
        sourceFilePath: firstVersionSeeds.responseSourcePath,
        exportName: 'v20260303ResponseSchema',
      },
      toSchemaConstName,
      schemaFilePathForVersion: (version, kind) =>
        schemaFilePathForVersion(outputDirectory, version, kind),
    });

    const requestV1 = await fs.readFile(
      schemaFilePathForVersion(outputDirectory, '2026-03-03', 'request'),
      'utf8',
    );
    const requestV2 = await fs.readFile(
      schemaFilePathForVersion(outputDirectory, '2026-03-09', 'request'),
      'utf8',
    );
    const responseV1 = await fs.readFile(
      schemaFilePathForVersion(outputDirectory, '2026-03-03', 'response'),
      'utf8',
    );
    const responseV2 = await fs.readFile(
      schemaFilePathForVersion(outputDirectory, '2026-03-09', 'response'),
      'utf8',
    );

    expect(requestResult.createdVersions).toEqual(versions);
    expect(responseResult.createdVersions).toEqual(versions);

    expect(requestV1).toContain('DO NOT EDIT');
    expect(requestV2).toContain('export const v20260309RequestSchema');
    expect(requestV2).toContain('isOpenToday: z.coerce.boolean().optional()');
    expect(requestV2).not.toContain('openToday:');

    expect(responseV1).toContain('const catalogItemSchema');
    expect(responseV2).toContain('export const v20260309ResponseSchema');
    expect(responseV2).toContain('seoUrl: z.string()');
    expect(responseV2).toContain(
      'name: z.object({ originalName: z.string(), translatedName: z.string() }).strict()',
    );
    expect(responseV2).not.toContain('slug: z.string()');

    expect(hasRelativeImport(requestV1)).toBe(false);
    expect(hasRelativeImport(requestV2)).toBe(false);
    expect(hasRelativeImport(responseV1)).toBe(false);
    expect(hasRelativeImport(responseV2)).toBe(false);

    expect(
      requestResult.schemasByVersion
        .get('2026-03-09')
        ?.safeParse({ isOpenToday: true }).success,
    ).toBe(true);
    expect(
      responseResult.schemasByVersion
        .get('2026-03-09')
        ?.safeParse({
          results: [
            {
              seoUrl: 'x',
              name: {
                originalName: 'a',
                translatedName: 'b',
              },
            },
          ],
        }).success,
    ).toBe(true);
  });

  it('overwrites existing generated files deterministically', async () => {
    const firstVersionSeeds = await seedVersion20260303Sources(outputDirectory);
    const existingVersionPath = schemaFilePathForVersion(
      outputDirectory,
      '2026-03-09',
      'request',
    );
    await fs.mkdir(path.dirname(existingVersionPath), { recursive: true });
    await fs.writeFile(
      existingVersionPath,
      [
        "import { z } from 'zod';",
        '',
        'export const v20260309RequestSchema = z.object({',
        '  sentinel: z.literal(true),',
        '}).strict();',
        '',
        'export default v20260309RequestSchema;',
        '',
      ].join('\n'),
      'utf8',
    );

    const generator = new VersionedSchemaGenerator();

    const result = await generator.generateVersionedSchemas({
      supportedVersions: versions,
      compiledVersions,
      kind: 'request',
      firstVersionSeed: {
        sourceFilePath: firstVersionSeeds.requestSourcePath,
        exportName: 'v20260303RequestSchema',
      },
      toSchemaConstName,
      schemaFilePathForVersion: (version, kind) =>
        schemaFilePathForVersion(outputDirectory, version, kind),
    });

    const generatedContent = await fs.readFile(existingVersionPath, 'utf8');
    expect(generatedContent).toContain('isOpenToday: z.coerce.boolean().optional()');
    expect(generatedContent).not.toContain('sentinel: z.literal(true)');
    expect(result.createdVersions).toEqual(versions);
  });

  it('applies replace patch then remove/set on the same payload path', async () => {
    const firstVersionSeeds = await seedVersion20260303Sources(outputDirectory);
    const generator = new VersionedSchemaGenerator();

    const replaceAndPatchVersions: readonly CompiledVersion[] = [
      compiledVersions[0],
      {
        ...compiledVersions[1],
        requestChanges: [],
        responseChanges: [
          {
            description: 'Replace item schema and patch fields',
            schemaPatch: {
              payloadPath: '/results/*',
              replace: {
                zod: annotateZodSchemaExpression(
                  z
                    .object({
                      type: z.enum(['fixedLocation', 'itinerary']),
                      location: z.string().optional(),
                    })
                    .strict(),
                  "z.object({ type: z.enum(['fixedLocation', 'itinerary']), location: z.string().optional() }).strict()",
                ),
              },
              remove: ['location'],
              set: {
                stops: {
                  zod: annotateZodSchemaExpression(
                    z.array(z.string()),
                    'z.array(z.string())',
                  ),
                },
              },
            },
            downgrade: (payload) => payload,
          },
        ],
      },
    ];

    await generator.generateVersionedSchemas({
      supportedVersions: versions,
      compiledVersions: replaceAndPatchVersions,
      kind: 'response',
      firstVersionSeed: {
        sourceFilePath: firstVersionSeeds.responseSourcePath,
        exportName: 'v20260303ResponseSchema',
      },
      toSchemaConstName,
      schemaFilePathForVersion: (version, kind) =>
        schemaFilePathForVersion(outputDirectory, version, kind),
    });

    const responseV2 = await fs.readFile(
      schemaFilePathForVersion(outputDirectory, '2026-03-09', 'response'),
      'utf8',
    );

    expect(responseV2).toContain("type: z.enum(['fixedLocation', 'itinerary'])");
    expect(responseV2).toContain('stops: z.array(z.string())');
    expect(responseV2).not.toContain('location: z.string().optional()');
  });

  it('fails when first version seed source file is missing', async () => {
    const generator = new VersionedSchemaGenerator();

    await expect(
      generator.generateVersionedSchemas({
        supportedVersions: versions,
        compiledVersions,
        kind: 'request',
        firstVersionSeed: {
          sourceFilePath: path.join(outputDirectory, 'missing.seed.ts'),
          exportName: 'v20260303RequestSchema',
        },
        toSchemaConstName,
        schemaFilePathForVersion: (version, kind) =>
          schemaFilePathForVersion(outputDirectory, version, kind),
      }),
    ).rejects.toThrow('Missing first-version schema seed source file');
  });

  it('fails when payload path cannot be resolved in source schema', async () => {
    const firstVersionSeeds = await seedVersion20260303Sources(outputDirectory);
    const generator = new VersionedSchemaGenerator();

    const invalidCompiledVersions: readonly CompiledVersion[] = [
      compiledVersions[0],
      {
        ...compiledVersions[1],
        requestChanges: [
          {
            ...compiledVersions[1].requestChanges[0],
            schemaPatch: {
              payloadPath: '/unknown',
              set: {
                x: {
                  zod: annotateZodSchemaExpression(z.string(), 'z.string()'),
                },
              },
            },
          },
        ],
      },
    ];

    await expect(
      generator.generateVersionedSchemas({
        supportedVersions: versions,
        compiledVersions: invalidCompiledVersions,
        kind: 'request',
        firstVersionSeed: {
          sourceFilePath: firstVersionSeeds.requestSourcePath,
          exportName: 'v20260303RequestSchema',
        },
        toSchemaConstName,
        schemaFilePathForVersion: (version, kind) =>
          schemaFilePathForVersion(outputDirectory, version, kind),
      }),
    ).rejects.toThrow('Missing segment "unknown"');
  });

  it('fails when zod schema expression metadata cannot be resolved', async () => {
    const firstVersionSeeds = await seedVersion20260303Sources(outputDirectory);
    const generator = new VersionedSchemaGenerator();

    const invalidCompiledVersions: readonly CompiledVersion[] = [
      compiledVersions[0],
      {
        ...compiledVersions[1],
        requestChanges: [
          {
            ...compiledVersions[1].requestChanges[0],
            schemaPatch: {
              payloadPath: '/',
              set: {
                isOpenToday: {
                  zod: z.coerce.boolean().optional(),
                },
              },
            },
          },
        ],
      },
    ];

    await expect(
      generator.generateVersionedSchemas({
        supportedVersions: versions,
        compiledVersions: invalidCompiledVersions,
        kind: 'request',
        firstVersionSeed: {
          sourceFilePath: firstVersionSeeds.requestSourcePath,
          exportName: 'v20260303RequestSchema',
        },
        toSchemaConstName,
        schemaFilePathForVersion: (version, kind) =>
          schemaFilePathForVersion(outputDirectory, version, kind),
      }),
    ).rejects.toThrow('Could not resolve zod schema expression');
  });
});

async function seedVersion20260303Sources(outputDirectory: string): Promise<{
  requestSourcePath: string;
  responseSourcePath: string;
}> {
  const sourceDirectory = path.join(outputDirectory, 'seed');
  await fs.mkdir(sourceDirectory, { recursive: true });

  const helperPath = path.join(sourceDirectory, 'catalog-item.ts');
  const requestSourcePath = path.join(sourceDirectory, '2026-03-03.request.ts');
  const responseSourcePath = path.join(sourceDirectory, '2026-03-03.response.ts');

  await fs.writeFile(
    helperPath,
    [
      "import { z } from 'zod';",
      '',
      'export const catalogItemSchema = z.object({',
      '  slug: z.string(),',
      '  name: z.string(),',
      '}).strict();',
      '',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    requestSourcePath,
    [
      "import { z } from 'zod';",
      '',
      'export const v20260303RequestSchema = z.object({',
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
    responseSourcePath,
    [
      "import { z } from 'zod';",
      "import { catalogItemSchema } from './catalog-item';",
      '',
      'export const v20260303ResponseSchema = z.object({',
      '  results: z.array(catalogItemSchema),',
      '}).strict();',
      '',
      'export type v20260303ResponseSchemaType = z.infer<typeof v20260303ResponseSchema>;',
      '',
      'export default v20260303ResponseSchema;',
      '',
    ].join('\n'),
    'utf8',
  );

  return {
    requestSourcePath,
    responseSourcePath,
  };
}

function toSchemaConstName(
  version: `${number}-${number}-${number}`,
  kind: 'request' | 'response',
): string {
  const normalizedVersion = version.replace(/-/g, '');
  return `v${normalizedVersion}${kind === 'request' ? 'Request' : 'Response'}Schema`;
}
