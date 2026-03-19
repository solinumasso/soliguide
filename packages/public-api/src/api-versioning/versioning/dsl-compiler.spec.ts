import { z } from 'zod';
import { rawProperty } from '../artifacts/openapi/openapi.dsl';
import { DslCompiler } from './dsl-compiler';
import type {
  FieldSpec,
  RequestVersionChange,
  ResponseVersionChange,
} from './versioning.types';

const stringSpec: FieldSpec = {
  zod: z.string(),
  openApi: rawProperty({ type: 'string' }, { required: true }),
};

const booleanSpec: FieldSpec = {
  zod: z.boolean().optional(),
  openApi: rawProperty({ type: 'boolean' }, { required: false }),
};

const nameObjectSpec: FieldSpec = {
  zod: z
    .object({
      translatedName: z.string(),
    })
    .strict(),
  openApi: rawProperty(
    {
      type: 'object',
      required: ['translatedName'],
      properties: {
        translatedName: { type: 'string' },
      },
    },
    { required: true },
  ),
};

describe('ProposalC DslCompiler', () => {
  let compiler: DslCompiler;

  beforeEach(() => {
    compiler = new DslCompiler();
  });

  it('compiles addField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'add',
      operation: {
        kind: 'addField',
        field: 'isOpenToday',
        spec: booleanSpec,
        buildValue: () => true,
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ page: 1 })).resolves.toEqual({
      page: 1,
      isOpenToday: true,
    });
    expect(compiled.schemaPatch.set).toHaveProperty('isOpenToday');
    expect(compiled.openApiPatch.set).toHaveProperty('isOpenToday');
  });

  it('compiles removeField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'remove',
      operation: {
        kind: 'removeField',
        field: 'openToday',
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(
      compiled.upgrade({ openToday: true, page: 1 }),
    ).resolves.toEqual({
      page: 1,
    });
    expect(compiled.schemaPatch.remove).toContain('openToday');
  });

  it('compiles renameField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'rename',
      operation: {
        kind: 'renameField',
        from: 'openToday',
        to: 'isOpenToday',
        toSpec: booleanSpec,
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ openToday: true })).resolves.toEqual({
      isOpenToday: true,
    });
  });

  it('compiles copyField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'copy',
      operation: {
        kind: 'copyField',
        from: 'title',
        to: 'subtitle',
        toSpec: stringSpec,
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ title: 'A' })).resolves.toEqual({
      title: 'A',
      subtitle: 'A',
    });
  });

  it('compiles moveField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'move',
      operation: {
        kind: 'moveField',
        from: 'slug',
        to: 'seoUrl',
        toSpec: stringSpec,
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ slug: 'abc' })).resolves.toEqual({
      seoUrl: 'abc',
    });
  });

  it('compiles replaceField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'replace',
      operation: {
        kind: 'replaceField',
        field: 'title',
        spec: stringSpec,
        mapValue: (value) => String(value).toUpperCase(),
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ title: 'book' })).resolves.toEqual({
      title: 'BOOK',
    });
  });

  it('compiles splitField request operation', async () => {
    const change: RequestVersionChange = {
      description: 'split',
      operation: {
        kind: 'splitField',
        from: 'name',
        into: {
          originalName: stringSpec,
          translatedName: stringSpec,
        },
        split: (value) => ({
          originalName: value,
          translatedName: value,
        }),
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ name: 'Book' })).resolves.toEqual({
      originalName: 'Book',
      translatedName: 'Book',
    });
  });

  it('compiles mergeFields request operation', async () => {
    const change: RequestVersionChange = {
      description: 'merge',
      operation: {
        kind: 'mergeFields',
        from: ['firstName', 'lastName'],
        to: 'name',
        toSpec: stringSpec,
        merge: (values) =>
          `${values.firstName as string} ${values.lastName as string}`,
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(
      compiled.upgrade({ firstName: 'John', lastName: 'Doe' }),
    ).resolves.toEqual({ name: 'John Doe' });
  });

  it('compiles customTransform request operation', async () => {
    const change: RequestVersionChange = {
      description: 'custom',
      operation: {
        kind: 'customTransform',
        schemaPatch: {
          set: {
            normalized: stringSpec,
          },
        },
        upgrade: (container) => ({
          ...container,
          normalized: 'ok',
        }),
      },
    };

    const compiled = compiler.compileRequestChange(change);

    await expect(compiled.upgrade({ value: 1 })).resolves.toEqual({
      value: 1,
      normalized: 'ok',
    });
  });

  it('compiles response downgrade for rename, replace and split/merge', async () => {
    const renameChange: ResponseVersionChange = {
      description: 'rename response',
      operation: {
        kind: 'renameField',
        from: 'slug',
        to: 'seoUrl',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        toSpec: stringSpec,
      },
    };

    const replaceChange: ResponseVersionChange = {
      description: 'replace response',
      operation: {
        kind: 'replaceField',
        field: 'name',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        spec: nameObjectSpec,
        mapValue: (value) => value,
        downgradeValue: (value) =>
          typeof value === 'object' && value
            ? (value as Record<string, unknown>).translatedName
            : value,
      },
    };

    const splitChange: ResponseVersionChange = {
      description: 'split response',
      operation: {
        kind: 'splitField',
        from: 'name',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        into: {
          firstName: stringSpec,
          lastName: stringSpec,
        },
        split: () => ({ firstName: 'A', lastName: 'B' }),
        merge: (values) =>
          `${values.firstName as string} ${values.lastName as string}`,
      },
    };

    const mergeChange: ResponseVersionChange = {
      description: 'merge response',
      operation: {
        kind: 'mergeFields',
        from: ['firstName', 'lastName'],
        to: 'name',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        toSpec: stringSpec,
        merge: (values) =>
          `${values.firstName as string} ${values.lastName as string}`,
        split: (value) => ({
          firstName: String(value).split(' ')[0],
          lastName: String(value).split(' ')[1] ?? '',
        }),
      },
    };

    const renameCompiled = compiler.compileResponseChange(renameChange);
    const replaceCompiled = compiler.compileResponseChange(replaceChange);
    const splitCompiled = compiler.compileResponseChange(splitChange);
    const mergeCompiled = compiler.compileResponseChange(mergeChange);

    await expect(
      renameCompiled.downgrade({ results: [{ seoUrl: 'abc' }] }),
    ).resolves.toEqual({ results: [{ slug: 'abc' }] });

    await expect(
      replaceCompiled.downgrade({
        results: [{ name: { translatedName: 'Book' } }],
      }),
    ).resolves.toEqual({ results: [{ name: 'Book' }] });

    await expect(
      splitCompiled.downgrade({ results: [{ firstName: 'A', lastName: 'B' }] }),
    ).resolves.toEqual({ results: [{ name: 'A B' }] });

    await expect(
      mergeCompiled.downgrade({ results: [{ name: 'A B' }] }),
    ).resolves.toEqual({ results: [{ firstName: 'A', lastName: 'B' }] });
  });
});
