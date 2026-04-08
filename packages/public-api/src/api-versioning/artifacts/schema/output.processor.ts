import { Node, SyntaxKind, type SourceFile, type Statement } from 'ts-morph';

export class VersionedSchemaOutputProcessor {
  process(input: {
    workingSource: SourceFile;
    inputSchemaConstName: string;
    outputSchemaConstName: string;
    outputPayloadTypeName: string;
    outputSchemaTypeName: string;
  }): void {
    this.normalizeExports(
      input.workingSource,
      input.inputSchemaConstName,
      input.outputSchemaConstName,
      input.outputPayloadTypeName,
      input.outputSchemaTypeName,
    );
    this.pruneUnusedDeclarations(input.workingSource);
    input.workingSource.organizeImports();
    input.workingSource.formatText();
  }

  private normalizeExports(
    sourceFile: SourceFile,
    inputSchemaConstName: string,
    outputSchemaConstName: string,
    outputPayloadTypeName: string,
    outputSchemaTypeName: string,
  ): void {
    const rootSchemaDeclaration = this.findRootSchemaDeclaration(
      sourceFile,
      inputSchemaConstName,
    );

    if (inputSchemaConstName !== outputSchemaConstName) {
      rootSchemaDeclaration.rename(outputSchemaConstName);
    }

    for (const variableStatement of sourceFile.getVariableStatements()) {
      const hasRootSchema = variableStatement
        .getDeclarations()
        .some((declaration) => declaration.getName() === outputSchemaConstName);

      variableStatement.setIsExported(hasRootSchema);
    }

    for (const typeAlias of sourceFile.getTypeAliases()) {
      typeAlias.setIsExported(false);
    }

    for (const exportDeclaration of sourceFile.getExportDeclarations()) {
      exportDeclaration.remove();
    }

    for (const exportAssignment of sourceFile.getExportAssignments()) {
      exportAssignment.remove();
    }

    sourceFile.addTypeAlias({
      isExported: true,
      name: outputPayloadTypeName,
      type: `z.infer<typeof ${outputSchemaConstName}>`,
    });

    sourceFile.addTypeAlias({
      isExported: true,
      name: outputSchemaTypeName,
      type: `z.infer<typeof ${outputSchemaConstName}>`,
    });

    sourceFile.addExportAssignment({
      isExportEquals: false,
      expression: outputSchemaConstName,
    });
  }

  private pruneUnusedDeclarations(sourceFile: SourceFile): void {
    const requiredNames = this.readRequiredLocalNames(sourceFile);

    for (let cycle = 0; cycle < 20; cycle += 1) {
      let removed = false;

      for (const declaration of sourceFile.getVariableDeclarations()) {
        const variableStatement = declaration.getVariableStatement();
        if (!variableStatement || variableStatement.isExported()) {
          continue;
        }

        if (!requiredNames.has(declaration.getName())) {
          declaration.remove();
          removed = true;
        }
      }

      for (const typeAlias of sourceFile.getTypeAliases()) {
        if (typeAlias.isExported()) {
          continue;
        }

        if (!requiredNames.has(typeAlias.getName())) {
          typeAlias.remove();
          removed = true;
        }
      }

      if (!removed) {
        return;
      }

      requiredNames.clear();
      for (const name of this.readRequiredLocalNames(sourceFile)) {
        requiredNames.add(name);
      }
    }
  }

  private readRequiredLocalNames(sourceFile: SourceFile): Set<string> {
    const localNames = new Set<string>();

    for (const declaration of sourceFile.getVariableDeclarations()) {
      localNames.add(declaration.getName());
    }

    for (const typeAlias of sourceFile.getTypeAliases()) {
      localNames.add(typeAlias.getName());
    }

    const required = new Set<string>();
    const queue: string[] = [];

    const enqueue = (name: string) => {
      if (!localNames.has(name) || required.has(name)) {
        return;
      }

      required.add(name);
      queue.push(name);
    };

    for (const statement of sourceFile.getStatements()) {
      if (!this.isExportedStatement(statement)) {
        continue;
      }

      if (Node.isVariableStatement(statement)) {
        for (const declaration of statement.getDeclarations()) {
          enqueue(declaration.getName());
        }
      }

      if (Node.isTypeAliasDeclaration(statement)) {
        enqueue(statement.getName());
      }
    }

    for (const exportAssignment of sourceFile.getExportAssignments()) {
      for (const identifier of exportAssignment.getDescendantsOfKind(
        SyntaxKind.Identifier,
      )) {
        enqueue(identifier.getText());
      }
    }

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        continue;
      }

      const variableDeclaration = sourceFile.getVariableDeclaration(current);
      if (variableDeclaration) {
        for (const identifier of variableDeclaration.getDescendantsOfKind(
          SyntaxKind.Identifier,
        )) {
          const nextName = identifier.getText();
          if (nextName !== current) {
            enqueue(nextName);
          }
        }
      }

      const typeAlias = sourceFile.getTypeAlias(current);
      if (typeAlias) {
        for (const identifier of typeAlias.getDescendantsOfKind(
          SyntaxKind.Identifier,
        )) {
          const nextName = identifier.getText();
          if (nextName !== current) {
            enqueue(nextName);
          }
        }
      }
    }

    return required;
  }

  private isExportedStatement(statement: Statement): boolean {
    if (Node.isVariableStatement(statement)) {
      return statement.isExported();
    }

    if (Node.isTypeAliasDeclaration(statement)) {
      return statement.isExported();
    }

    return false;
  }

  private findRootSchemaDeclaration(
    sourceFile: SourceFile,
    schemaConstName: string,
  ) {
    const declaration = sourceFile.getVariableDeclaration(schemaConstName);

    if (!declaration) {
      throw new Error(
        `Could not find root schema declaration "${schemaConstName}".`,
      );
    }

    return declaration;
  }
}
