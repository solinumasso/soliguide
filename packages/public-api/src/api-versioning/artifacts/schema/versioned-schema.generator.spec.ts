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

  it('patches next version files from previous version seeds', async () => {
    await seedVersion20260303(outputDirectory);

    const generator = new VersionedSchemaGenerator();

    const requestResult = await generator.generateVersionedSchemas({
      contractsDirectory: outputDirectory,
      supportedVersions: versions,
      compiledVersions,
      kind: 'request',
      toSchemaConstName,
    });

    const responseResult = await generator.generateVersionedSchemas({
      contractsDirectory: outputDirectory,
      supportedVersions: versions,
      compiledVersions,
      kind: 'response',
      toSchemaConstName,
    });

    const requestV2 = await fs.readFile(
      path.join(outputDirectory, '2026-03-09.request.schema.ts'),
      'utf8',
    );
    const responseV2 = await fs.readFile(
      path.join(outputDirectory, '2026-03-09.response.schema.ts'),
      'utf8',
    );

    expect(requestV2).toContain('export const v20260309RequestSchema');
    expect(requestV2).toContain('isOpenToday: z.coerce.boolean().optional()');
    expect(requestV2).not.toContain('openToday:');

    expect(responseV2).toContain('export const v20260309ResponseSchema');
    expect(responseV2).toContain('seoUrl: z.string()');
    expect(responseV2).toContain(
      'name: z.object({ originalName: z.string(), translatedName: z.string() }).strict()',
    );
    expect(responseV2).not.toContain('slug: z.string()');
    expect(requestResult.createdVersions).toEqual(['2026-03-09']);
    expect(responseResult.createdVersions).toEqual(['2026-03-09']);
    expect(
      requestResult.schemasByVersion.get('2026-03-09')?.safeParse({
        isOpenToday: true,
      }).success,
    ).toBe(true);
    expect(
      responseResult.schemasByVersion.get('2026-03-09')?.safeParse({
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

  it('does not overwrite existing version schema files', async () => {
    await seedVersion20260303(outputDirectory);
    const existingVersionPath = path.join(
      outputDirectory,
      '2026-03-09.request.schema.ts',
    );
    await fs.writeFile(
      existingVersionPath,
      [
        "import { z } from 'zod';",
        '',
        'export const v20260309RequestSchema = z.object({',
        '  sentinel: z.literal(true),',
        '}).strict();',
        '',
        'export type v20260309RequestSchemaType = z.infer<typeof v20260309RequestSchema>;',
        '',
        'export default v20260309RequestSchema;',
        '',
      ].join('\n'),
      'utf8',
    );

    const generator = new VersionedSchemaGenerator();

    const result = await generator.generateVersionedSchemas({
      contractsDirectory: outputDirectory,
      supportedVersions: versions,
      compiledVersions,
      kind: 'request',
      toSchemaConstName,
    });

    const existingContent = await fs.readFile(existingVersionPath, 'utf8');
    expect(existingContent).toContain('sentinel: z.literal(true)');
    expect(result.createdVersions).toEqual([]);
    expect(result.schemasByVersion.size).toBe(0);
  });

  it('fails when first version seed file is missing', async () => {
    const generator = new VersionedSchemaGenerator();

    await expect(
      generator.generateVersionedSchemas({
        contractsDirectory: outputDirectory,
        supportedVersions: versions,
        compiledVersions,
        kind: 'request',
        toSchemaConstName,
      }),
    ).rejects.toThrow('Missing first-version schema seed file');
  });

  it('fails when payload path cannot be resolved in source schema', async () => {
    await seedVersion20260303(outputDirectory);

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
        contractsDirectory: outputDirectory,
        supportedVersions: versions,
        compiledVersions: invalidCompiledVersions,
        kind: 'request',
        toSchemaConstName,
      }),
    ).rejects.toThrow('Missing segment "unknown"');
  });

  it('fails when zod schema expression metadata cannot be resolved', async () => {
    await seedVersion20260303(outputDirectory);

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
        contractsDirectory: outputDirectory,
        supportedVersions: versions,
        compiledVersions: invalidCompiledVersions,
        kind: 'request',
        toSchemaConstName,
      }),
    ).rejects.toThrow('Could not resolve zod schema expression');
  });
});

async function seedVersion20260303(contractsDirectory: string): Promise<void> {
  await fs.mkdir(contractsDirectory, { recursive: true });

  await fs.writeFile(
    path.join(contractsDirectory, '2026-03-03.request.schema.ts'),
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
    path.join(contractsDirectory, '2026-03-03.response.schema.ts'),
    [
      "import { z } from 'zod';",
      '',
      'export const v20260303ResponseSchema = z.object({',
      '  results: z.array(z.object({',
      '    slug: z.string(),',
      '    name: z.string(),',
      '  }).strict()),',
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

function toSchemaConstName(
  version: `${number}-${number}-${number}`,
  kind: 'request' | 'response',
): string {
  const normalizedVersion = version.replace(/-/g, '');
  return `v${normalizedVersion}${kind === 'request' ? 'Request' : 'Response'}Schema`;
}
