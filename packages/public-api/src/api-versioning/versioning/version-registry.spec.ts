import { z } from 'zod';
import { rawProperty } from '../artifacts/openapi/openapi.dsl';
import { DslCompiler } from './dsl-compiler';
import { VersionRegistry } from './version-registry';
import type { FieldSpec, VersioningDefinition } from './versioning.types';

const stringSpec: FieldSpec = {
  zod: z.string(),
  openApi: rawProperty({ type: 'string' }, { required: true }),
};

function buildDefinition(
  overrides: Partial<VersioningDefinition> = {},
): VersioningDefinition {
  return {
    resource: 'search',
    baseRequestSchema: z.object({ openToday: z.boolean().optional() }).strict(),
    baseResponseSchema: z
      .object({
        results: z.array(
          z
            .object({
              slug: z.string(),
            })
            .strict(),
        ),
      })
      .strict(),
    baseRequestOpenApiSchema: {
      type: 'object',
      properties: {
        openToday: { type: 'boolean' },
      },
    },
    baseResponseOpenApiSchema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              slug: { type: 'string' },
            },
          },
        },
      },
    },
    versions: [
      {
        version: '2026-03-03',
        description: 'Initial',
        requestChanges: [],
        responseChanges: [],
      },
      {
        version: '2026-03-09',
        description: 'Second',
        requestChanges: [
          {
            description: 'Rename request field.',
            operation: {
              kind: 'renameField',
              from: 'openToday',
              to: 'isOpenToday',
              toSpec: stringSpec,
            },
          },
        ],
        responseChanges: [
          {
            description: 'Rename response field.',
            operation: {
              kind: 'renameField',
              from: 'slug',
              to: 'seoUrl',
              payloadPath: '/results/*',
              openApiPath: '/properties/results/items',
              toSpec: stringSpec,
            },
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe('ProposalC VersionRegistry', () => {
  it('exposes supported versions and canonical version', () => {
    const registry = new VersionRegistry(buildDefinition(), new DslCompiler());

    expect(registry.supportedVersions).toEqual(['2026-03-03', '2026-03-09']);
    expect(registry.canonicalVersion).toBe('2026-03-09');
    expect(registry.compiledVersions).toHaveLength(2);
  });

  it('throws when versions are empty', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [],
          }),
        ),
    ).toThrow('At least one API version must be configured.');
  });

  it('throws when versions are not strictly chronological', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-09',
                description: 'Newer',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-03',
                description: 'Older',
                requestChanges: [],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).toThrow('strict chronological order');
  });

  it('throws when payload path is invalid', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Invalid path',
                requestChanges: [
                  {
                    description: 'Bad request path',
                    operation: {
                      kind: 'removeField',
                      field: 'openToday',
                      payloadPath: 'invalid',
                    },
                  },
                ],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).toThrow('Invalid payloadPath');
  });

  it('throws when response splitField has no merge mapper', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Invalid split',
                requestChanges: [],
                responseChanges: [
                  {
                    description: 'Split without merge',
                    operation: {
                      kind: 'splitField',
                      from: 'name',
                      into: {
                        firstName: stringSpec,
                      },
                      split: () => ({ firstName: 'A' }),
                    },
                  },
                ],
              },
            ],
          }),
        ),
    ).toThrow('splitField must define merge');
  });

  it('throws when response mergeFields has no split mapper', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Invalid merge',
                requestChanges: [],
                responseChanges: [
                  {
                    description: 'Merge without split',
                    operation: {
                      kind: 'mergeFields',
                      from: ['firstName', 'lastName'],
                      to: 'name',
                      toSpec: stringSpec,
                      merge: (values) =>
                        `${values.firstName as string} ${values.lastName as string}`,
                    },
                  },
                ],
              },
            ],
          }),
        ),
    ).toThrow('mergeFields must define split');
  });

  it('throws when response replaceField has no downgrade mapper', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Invalid replace',
                requestChanges: [],
                responseChanges: [
                  {
                    description: 'Replace without downgrade mapper',
                    operation: {
                      kind: 'replaceField',
                      field: 'name',
                      spec: stringSpec,
                      mapValue: (value) => value,
                    },
                  },
                ],
              },
            ],
          }),
        ),
    ).toThrow('replaceField must define downgradeValue');
  });

  it('allows request customTransform without schema patch for value-only migrations', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Value-only custom transform',
                requestChanges: [
                  {
                    description: 'Trim only',
                    operation: {
                      kind: 'customTransform',
                      upgrade: () => undefined,
                    },
                  },
                ],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).not.toThrow();
  });

  it('throws when request addField has an empty field name', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Invalid empty field',
                requestChanges: [
                  {
                    description: 'Add empty field',
                    operation: {
                      kind: 'addField',
                      field: ' ',
                      spec: stringSpec,
                    },
                  },
                ],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).toThrow('empty field in addField');
  });

  it('throws when multiple response changes target the same field in one version', () => {
    expect(
      () =>
        new VersionRegistry(
          buildDefinition({
            versions: [
              {
                version: '2026-03-03',
                description: 'Initial',
                requestChanges: [],
                responseChanges: [],
              },
              {
                version: '2026-03-09',
                description: 'Conflicting response operations',
                requestChanges: [],
                responseChanges: [
                  {
                    description: 'Rename name to fullName',
                    operation: {
                      kind: 'renameField',
                      from: 'name',
                      to: 'fullName',
                      payloadPath: '/results/*',
                      openApiPath: '/properties/results/items',
                      toSpec: stringSpec,
                    },
                  },
                  {
                    description: 'Split fullName',
                    operation: {
                      kind: 'splitField',
                      from: 'fullName',
                      payloadPath: '/results/*',
                      openApiPath: '/properties/results/items',
                      into: {
                        firstName: stringSpec,
                      },
                      split: () => ({ firstName: 'A' }),
                      merge: () => 'A',
                    },
                  },
                ],
              },
            ],
          }),
        ),
    ).toThrow('multiple response changes targeting field "fullName"');
  });
});
