import {
  IndentationText,
  NewLineKind,
  Project,
  QuoteKind,
  type SourceFile,
} from 'ts-morph';

export type VersionedSchemaGeneratorConfig = {
  kind: 'request' | 'response';
  baseSchemaPath: string;
  versionDefinitionPath: string;
  changesSourcePath: string;
  outputPath: string;
  inputSchemaConstName: string;
  outputSchemaConstName: string;
  outputPayloadTypeName: string;
  outputSchemaTypeName: string;
};

export type ResolvedVersionedSchemaGeneratorConfig =
  VersionedSchemaGeneratorConfig;

export class VersionedSchemaProjectFactory {
  createProject(): Project {
    return new Project({
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
        quoteKind: QuoteKind.Single,
        newLineKind: NewLineKind.LineFeed,
      },
    });
  }

  createWorkingSource(input: {
    project: Project;
    config: ResolvedVersionedSchemaGeneratorConfig;
  }): {
    baseSource: SourceFile;
    versionSource: SourceFile;
    changesSource: SourceFile;
    workingSource: SourceFile;
  } {
    const baseSource = input.project.addSourceFileAtPath(
      input.config.baseSchemaPath,
    );
    const versionSource = input.project.addSourceFileAtPath(
      input.config.versionDefinitionPath,
    );
    const changesSource = input.project.addSourceFileAtPath(
      input.config.changesSourcePath,
    );

    const workingSource = input.project.createSourceFile(
      '/versioned-schema.working.ts',
      baseSource.getFullText(),
      { overwrite: true },
    );

    return {
      baseSource,
      versionSource,
      changesSource,
      workingSource,
    };
  }
}
