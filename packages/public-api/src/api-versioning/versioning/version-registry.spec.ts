import { z } from 'zod';
import type {
  RequestChangeDefinition,
  ResponseChangeDefinition,
} from './changes';
import { DslCompiler } from './dsl-compiler';
import { VersionRegistry } from './version-registry';
import type { VersioningDefinition } from './versioning.types';

interface DeclarativeSchemaPatch {
  payloadPath: string;
  set?: Readonly<Record<string, z.ZodTypeAny>>;
  remove?: readonly string[];
}

const stringSpec = z.string();

function requestChange(
  description: string,
  schemaPatch: DeclarativeSchemaPatch,
): RequestChangeDefinition {
  return {
    description,
    toRequestOperation: () => ({
      kind: 'customTransform',
      payloadPath: schemaPatch.payloadPath,
      schemaPatch: {
        set: schemaPatch.set,
        remove: schemaPatch.remove,
      },
      upgrade: (container: Record<string, unknown>) => container,
    }),
  };
}

function responseChange(
  description: string,
  schemaPatch: DeclarativeSchemaPatch,
): ResponseChangeDefinition {
  return {
    description,
    toResponseOperation: () => ({
      kind: 'customTransform',
      payloadPath: schemaPatch.payloadPath,
      schemaPatch: {
        set: schemaPatch.set,
        remove: schemaPatch.remove,
      },
      downgrade: (container: Record<string, unknown>) => container,
    }),
  };
}

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
          requestChange('Rename request field.', {
            payloadPath: '/',
            remove: ['openToday'],
            set: {
              isOpenToday: stringSpec,
            },
          }),
        ],
        responseChanges: [
          responseChange('Rename response field.', {
            payloadPath: '/results/*',
            remove: ['slug'],
            set: {
              seoUrl: stringSpec,
            },
          }),
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

  it('throws when payload path is invalid in compiled request changes', () => {
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
                  requestChange('Bad request path', {
                    payloadPath: 'invalid',
                    remove: ['openToday'],
                  }),
                ],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).toThrow('Invalid payloadPath');
  });

  it('throws when compiled field spec has invalid zod schema', () => {
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
                description: 'Invalid zod schema',
                requestChanges: [
                  requestChange('Invalid patch set spec', {
                    payloadPath: '/',
                    set: {
                      isOpenToday: null as never,
                    },
                  }),
                ],
                responseChanges: [],
              },
            ],
          }),
        ),
    ).toThrow('must define a valid zod schema');
  });

  it('throws when multiple response changes target same field at same payloadPath', () => {
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
                  responseChange('First touch', {
                    payloadPath: '/results/*',
                    remove: ['name'],
                    set: {
                      fullName: stringSpec,
                    },
                  }),
                  responseChange('Second touch', {
                    payloadPath: '/results/*',
                    remove: ['fullName'],
                    set: {
                      firstName: stringSpec,
                    },
                  }),
                ],
              },
            ],
          }),
        ),
    ).toThrow('multiple response changes targeting field "fullName"');
  });
});
