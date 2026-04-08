import { z } from 'zod';
import { parseObjectPath } from './object-path.utils';
import type {
  CompiledVersion,
  FieldSpec,
  VersioningDefinition,
} from './versioning.types';

export class VersionDefinitionValidator {
  validateDefinition(definition: VersioningDefinition): void {
    const parsed = this.definitionSchema().safeParse(definition);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(issue?.message ?? 'Invalid versioning definition.');
    }

    const parsedDefinition = parsed.data as {
      versions: readonly { version: string }[];
    };
    this.assertDistinctAndChronologicalVersions(parsedDefinition.versions);
  }

  validateCompiledVersions(versions: readonly CompiledVersion[]): void {
    const parsed = this.compiledVersionsSchema().safeParse(versions);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new Error(issue?.message ?? 'Invalid compiled versions.');
    }

    const parsedVersions = parsed.data as readonly {
      version: string;
      responseChanges: {
        description: string;
        schemaPatch: {
          payloadPath: string;
          replace?: FieldSpec;
          set?: Readonly<Record<string, FieldSpec>>;
          remove?: readonly string[];
        };
      }[];
    }[];

    for (const version of parsedVersions) {
      const conflictError = this.responseConflictError(version);
      if (conflictError) {
        throw new Error(conflictError);
      }
    }
  }

  private definitionSchema(): z.ZodTypeAny {
    const changeDescriptionSchema = z.object({
      description: z.string().trim().min(1),
    });

    const versionSchema = z.object({
      version: z.iso.date(),
      description: z.string(),
      requestChanges: z.array(changeDescriptionSchema),
      responseChanges: z.array(changeDescriptionSchema),
    });

    return z.object({
      resource: z.string(),
      versions: z.array(versionSchema).min(1, {
        message: 'At least one API version must be configured.',
      }),
      baseRequestSchema: z.custom<unknown>((value) => Boolean(value), {
        message: 'A baseRequestSchema must be configured.',
      }),
      baseResponseSchema: z.custom<unknown>((value) => Boolean(value), {
        message: 'A baseResponseSchema must be configured.',
      }),
    });
  }

  private compiledVersionsSchema(): z.ZodTypeAny {
    const payloadPathSchema = z.string().refine(
      (objectPath) => {
        try {
          parseObjectPath(objectPath, { allowWildcard: true });
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Invalid payloadPath',
      },
    );

    const zodSchemaSchema = z.custom<z.ZodTypeAny>(
      (value): value is z.ZodTypeAny =>
        typeof value === 'object' &&
        value !== null &&
        typeof (value as { safeParse?: unknown }).safeParse === 'function',
      {
        message: 'must define a valid zod schema',
      },
    );

    const fieldSpecSchema: z.ZodType<FieldSpec> = z.object({
      zod: zodSchemaSchema,
    });

    const compiledChangeSchema = z.object({
      description: z.string(),
      schemaPatch: z.object({
        payloadPath: payloadPathSchema,
        replace: fieldSpecSchema.optional(),
        set: z.record(z.string(), fieldSpecSchema).optional(),
        remove: z.array(z.string()).optional(),
      }),
    });

    const compiledVersionSchema = z.object({
      version: z.string(),
      description: z.string(),
      requestChanges: z.array(compiledChangeSchema),
      responseChanges: z.array(compiledChangeSchema),
    });

    return z.array(compiledVersionSchema);
  }

  private assertDistinctAndChronologicalVersions(
    versions: readonly { version: string }[],
  ): void {
    const seenVersions = new Set<string>();
    let previousVersion: string | null = null;

    for (const version of versions) {
      if (seenVersions.has(version.version)) {
        throw new Error(
          `Duplicate API version detected: "${version.version}".`,
        );
      }

      if (previousVersion && version.version <= previousVersion) {
        throw new Error(
          `API versions must be in strict chronological order. "${version.version}" must be newer than "${previousVersion}".`,
        );
      }

      seenVersions.add(version.version);
      previousVersion = version.version;
    }
  }

  private responseConflictError(version: {
    version: string;
    responseChanges: {
      description: string;
      schemaPatch: {
        payloadPath: string;
        replace?: FieldSpec;
        set?: Readonly<Record<string, FieldSpec>>;
        remove?: readonly string[];
      };
    }[];
  }): string | undefined {
    const touchedByPath = new Map<string, string>();

    for (const change of version.responseChanges) {
      const payloadPath = change.schemaPatch.payloadPath;

      for (const field of this.touchedCompiledResponseFields(change)) {
        const conflictKey = `${payloadPath}::${field}`;
        const previousDescription = touchedByPath.get(conflictKey);

        if (previousDescription) {
          return `Version ${version.version} has multiple response changes targeting field "${field}" at payloadPath "${payloadPath}" ("${previousDescription}" and "${change.description}"). Consolidate them into a single change.`;
        }

        touchedByPath.set(conflictKey, change.description);
      }
    }

    return undefined;
  }

  private touchedCompiledResponseFields(change: {
    schemaPatch: {
      replace?: FieldSpec;
      set?: Readonly<Record<string, FieldSpec>>;
      remove?: readonly string[];
    };
  }): readonly string[] {
    const touchedFields = [
      ...(change.schemaPatch.remove ?? []),
      ...Object.keys(change.schemaPatch.set ?? {}),
    ];

    if (change.schemaPatch.replace) {
      touchedFields.push('$replace');
    }

    return touchedFields;
  }
}
