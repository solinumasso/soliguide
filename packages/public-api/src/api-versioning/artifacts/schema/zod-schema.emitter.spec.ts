import { z } from 'zod';
import { emitZodSchemaModule } from './zod-schema.emitter';

describe('emitZodSchemaModule', () => {
  it('emits z.any and warns when a schema node is unsupported', () => {
    const warnings: string[] = [];
    const schema = z.object({
      firstTuple: z.tuple([z.string(), z.number()]),
      secondTuple: z.tuple([z.string(), z.number()]),
    });

    const source = emitZodSchemaModule(schema, {
      constName: 'v20260309RequestSchema',
      onWarning: (message) => warnings.push(message),
    });

    expect(source).toContain('firstTuple: z.any()');
    expect(source).toContain('secondTuple: z.any()');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('ZodTuple');
  });
});
