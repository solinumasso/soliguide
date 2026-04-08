import { resolve } from 'node:path';
import { z } from 'zod';
import { ts } from 'ts-morph';
import { VersionedSchemaChangeApplier } from './change.applier';
import { VersionedSchemaChangeExtractor } from './change.extractor';
import { VersionedSchemaGeneratedFileWriter } from './file.writer';
import { VersionedSchemaOutputProcessor } from './output.processor';
import {
  ResolvedVersionedSchemaGeneratorConfig,
  VersionedSchemaGeneratorConfig,
  VersionedSchemaProjectFactory,
} from './project.factory';
import { VersionedSchemaSupportCopier } from './support.copier';

export class VersionedSchemaGenerator {
  private readonly config: ResolvedVersionedSchemaGeneratorConfig;
  private readonly projectFactory = new VersionedSchemaProjectFactory();
  private readonly changeExtractor = new VersionedSchemaChangeExtractor();
  private readonly changeApplier = new VersionedSchemaChangeApplier();
  private readonly supportCopier = new VersionedSchemaSupportCopier();
  private readonly outputProcessor = new VersionedSchemaOutputProcessor();
  private readonly fileWriter = new VersionedSchemaGeneratedFileWriter();

  constructor(config: VersionedSchemaGeneratorConfig) {
    this.config = {
      ...config,
      baseSchemaPath: resolve(process.cwd(), config.baseSchemaPath),
      versionDefinitionPath: resolve(
        process.cwd(),
        config.versionDefinitionPath,
      ),
      changesSourcePath: resolve(process.cwd(), config.changesSourcePath),
      outputPath: resolve(process.cwd(), config.outputPath),
    };
  }

  async generate(): Promise<GeneratedVersionedSchemaArtifact> {
    const project = this.projectFactory.createProject();
    const { versionSource, changesSource, workingSource } =
      this.projectFactory.createWorkingSource({
        project,
        config: this.config,
      });

    const orderedChanges = this.changeExtractor.extractChanges({
      kind: this.config.kind,
      versionSource,
      changesSource,
    });

    this.supportCopier.copySupport({
      workingSource,
      changesSource,
      orderedChanges,
    });

    for (const change of orderedChanges) {
      this.changeApplier.apply(
        workingSource,
        this.config.inputSchemaConstName,
        change,
      );
    }

    this.outputProcessor.process({
      workingSource,
      inputSchemaConstName: this.config.inputSchemaConstName,
      outputSchemaConstName: this.config.outputSchemaConstName,
      outputPayloadTypeName: this.config.outputPayloadTypeName,
      outputSchemaTypeName: this.config.outputSchemaTypeName,
    });

    const sourceText = workingSource.getFullText();
    await this.fileWriter.writeOutput(this.config.outputPath, workingSource);

    return {
      outputPath: this.config.outputPath,
      outputSchemaConstName: this.config.outputSchemaConstName,
      sourceText,
    };
  }
}

export async function generateVersionedSchemas(
  config: VersionedSchemaGeneratorConfig,
): Promise<GeneratedVersionedSchemaArtifact> {
  const generator = new VersionedSchemaGenerator(config);
  return generator.generate();
}

export type GeneratedVersionedSchemaArtifact = {
  outputPath: string;
  outputSchemaConstName: string;
  sourceText: string;
};

export function evaluateGeneratedVersionedSchema(
  moduleSourceText: string,
  schemaConstName: string,
  version: string,
): z.ZodTypeAny {
  const transpile = ts.transpileModule(moduleSourceText, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });

  const firstError = (transpile.diagnostics ?? []).find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (firstError) {
    const message = ts.flattenDiagnosticMessageText(
      firstError.messageText,
      '\n',
    );
    throw new Error(
      `Failed to transpile generated schema module for version ${version}: ${message}`,
    );
  }

  const module = { exports: {} as Record<string, unknown> };
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const executeModule = new Function(
      'require',
      'module',
      'exports',
      transpile.outputText,
    ) as (
      requireFn: NodeJS.Require,
      module: { exports: unknown },
      exports: unknown,
    ) => void;

    executeModule(require, module, module.exports);
  } catch (error) {
    throw new Error(
      `Failed to evaluate generated schema module for version ${version}: ${(error as Error).message}`,
    );
  }

  const exportedSchema = module.exports[schemaConstName];
  if (
    !exportedSchema ||
    typeof exportedSchema !== 'object' ||
    !('safeParse' in exportedSchema) ||
    typeof (exportedSchema as { safeParse?: unknown }).safeParse !== 'function'
  ) {
    throw new Error(
      `Generated schema "${schemaConstName}" for version ${version} did not evaluate to a Zod schema.`,
    );
  }

  return exportedSchema as z.ZodTypeAny;
}
