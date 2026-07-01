import { Project, SourceFile } from "ts-morph";

import { changeHandlers, ChangeApplyContext } from "./change-handlers";
import { orderChangesForBaseSchemaPaths } from "./change-order";
import { SchemaDocument } from "./schema-document";
import { AnyParsedChangeDefinition } from "./types";

export interface ApplySchemaChangesOptions {
  sourceFilePath: string;
  changes: AnyParsedChangeDefinition[];
}

export class SchemaAstEditor {
  public constructor(private readonly project: Project) {}

  public applyChanges(options: ApplySchemaChangesOptions): SourceFile {
    const sourceFile = this.project.addSourceFileAtPathIfExists(
      options.sourceFilePath
    );

    if (!sourceFile) {
      throw new Error(`Missing target schema file ${options.sourceFilePath}`);
    }

    const schemaDocument = SchemaDocument.fromSourceFile(sourceFile);
    const applyContext = schemaDocument.createApplyContext();

    for (const change of orderChangesForBaseSchemaPaths(options.changes)) {
      this.applyChange(applyContext, change);
    }

    schemaDocument.ensureMainSchemaFooter();

    return sourceFile;
  }

  public replaceVersionTokens(
    sourceFile: SourceFile,
    baseVersion: string,
    targetVersion: string
  ): void {
    const baseCompact = compactVersion(baseVersion);
    const targetCompact = compactVersion(targetVersion);

    let nextText = sourceFile.getFullText();
    if (baseVersion !== targetVersion) {
      nextText = nextText.split(baseVersion).join(targetVersion);
    }

    if (baseCompact !== targetCompact) {
      nextText = nextText.split(baseCompact).join(targetCompact);
    }

    sourceFile.replaceWithText(nextText);
  }

  public ensureMainSchemaFooter(
    sourceFile: SourceFile,
    mainSchemaVariableName?: string
  ): void {
    SchemaDocument.fromSourceFile(sourceFile).ensureMainSchemaFooter(
      mainSchemaVariableName
    );
  }

  private applyChange(
    context: ChangeApplyContext,
    change: AnyParsedChangeDefinition
  ): void {
    changeHandlers[change.type].apply(context, change as never);
  }
}

export function compactVersion(version: string): string {
  return version.replaceAll("-", "");
}
