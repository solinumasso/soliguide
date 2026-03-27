import { z } from 'zod';
import {
  AddFieldChange,
  MergeFieldsChange,
  RemoveFieldChange,
  RenameFieldChange,
  ReplaceFieldChange,
} from './changes';
import { DslCompiler } from './dsl-compiler';
import { readZodSchemaExpression } from './zod-schema-expression.utils';
import type { Version } from './versioning.types';

class AddOpenToday extends AddFieldChange {
  description = 'add open flag';
  field = 'isOpenToday';
  schema = z.boolean();

  override upgrade() {
    return true;
  }
}

class RenameSlug extends RenameFieldChange {
  description = 'rename slug';
  from = 'slug';
  to = 'seoUrl';
  schema = z.string();
}

class ReplaceName extends ReplaceFieldChange {
  description = 'replace name';
  field = 'name';
  schema = z.object({ translatedName: z.string() }).strict();
}

class MergeName extends MergeFieldsChange {
  description = 'merge names';
  from = ['firstName', 'lastName'] as const;
  to = 'name';
  schema = z.string();

  upgrade(values: Record<string, unknown>) {
    return `${String(values.firstName)} ${String(values.lastName)}`;
  }
}

class RemoveLegacyScore extends RemoveFieldChange {
  description = 'remove legacy score';
  field = 'legacyScore';

  override downgrade(container: Record<string, unknown>) {
    return container.slug ? 42 : 0;
  }
}

describe('DslCompiler', () => {
  it('compiles declarative changes into executable request/response changes', async () => {
    const compiler = new DslCompiler();

    const version: Version = {
      version: '2026-03-09',
      description: 'Second version',
      requestChanges: [new AddOpenToday()],
      responseChanges: [new RenameSlug()],
    };

    const compiled = compiler.compileVersion(version);

    expect(compiled.version).toBe(version.version);
    expect(compiled.description).toBe(version.description);
    expect(compiled.requestChanges).toHaveLength(1);
    expect(compiled.responseChanges).toHaveLength(1);
    await expect(compiled.requestChanges[0].upgrade({})).resolves.toEqual({
      isOpenToday: true,
    });
    await expect(
      compiled.responseChanges[0].downgrade({ seoUrl: 'abc' }),
    ).resolves.toEqual({ slug: 'abc' });
  });

  it('compiles multiple versions in order', () => {
    const compiler = new DslCompiler();
    const versions: readonly Version[] = [
      {
        version: '2026-03-03',
        description: 'Initial',
        requestChanges: [],
        responseChanges: [],
      },
      {
        version: '2026-03-09',
        description: 'Second',
        requestChanges: [new AddOpenToday()],
        responseChanges: [new RenameSlug()],
      },
    ];

    const compiled = compiler.compileVersions(versions);

    expect(compiled).toHaveLength(2);
    expect(compiled.map((version) => version.version)).toEqual([
      '2026-03-03',
      '2026-03-09',
    ]);
  });

  it('keeps removeField upgrade behavior and reintroduces on response downgrade', async () => {
    const compiler = new DslCompiler();
    const removeChange = new RemoveLegacyScore();

    const compiledRequest = compiler.compileRequestChange(removeChange);
    const compiledResponse = compiler.compileResponseChange(removeChange);

    await expect(
      compiledRequest.upgrade({
        legacyScore: 18,
        slug: 'abc',
      }),
    ).resolves.toEqual({
      slug: 'abc',
    });

    await expect(compiledResponse.downgrade({ slug: 'abc' })).resolves.toEqual({
      slug: 'abc',
      legacyScore: 42,
    });
  });

  it('overwrites existing value on removeField response downgrade', async () => {
    const compiler = new DslCompiler();
    const compiledResponse = compiler.compileResponseChange(
      new RemoveLegacyScore(),
    );

    await expect(
      compiledResponse.downgrade({ slug: 'abc', legacyScore: -1 }),
    ).resolves.toEqual({
      slug: 'abc',
      legacyScore: 42,
    });
  });

  it('annotates Add/Rename/Replace/Merge schemas with source expressions', () => {
    const compiler = new DslCompiler();

    const addCompiled = compiler.compileRequestChange(new AddOpenToday());
    const renameCompiled = compiler.compileRequestChange(new RenameSlug());
    const replaceCompiled = compiler.compileRequestChange(new ReplaceName());
    const mergeCompiled = compiler.compileRequestChange(new MergeName());

    expect(
      readZodSchemaExpression(addCompiled.schemaPatch.set!.isOpenToday.zod),
    ).toContain('z.boolean()');
    expect(
      readZodSchemaExpression(renameCompiled.schemaPatch.set!.seoUrl.zod),
    ).toContain('z.string()');
    const replaceExpression = readZodSchemaExpression(
      replaceCompiled.schemaPatch.set!.name.zod,
    );
    expect(replaceExpression).toContain('translatedName');
    expect(replaceExpression).toContain('.strict()');
    expect(
      readZodSchemaExpression(mergeCompiled.schemaPatch.set!.name.zod),
    ).toContain('z.string()');
  });
});
