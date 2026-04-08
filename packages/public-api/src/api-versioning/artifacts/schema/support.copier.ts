import {
  Node,
  SyntaxKind,
  type ImportDeclaration,
  type SourceFile,
} from 'ts-morph';
import { type ExtractedChange } from './types';

type LocalDeclaration = {
  name: string;
  text: string;
  order: number;
  references: string[];
};

export class VersionedSchemaSupportCopier {
  copySupport(input: {
    workingSource: SourceFile;
    changesSource: SourceFile;
    orderedChanges: ExtractedChange[];
  }): void {
    const changeExpressionIdentifiers = this.readIdentifiersFromChanges(
      input.changesSource,
      input.orderedChanges,
    );
    const localDeclarations = this.readRequiredLocalDeclarations(
      input.changesSource,
      input.orderedChanges,
    );
    const localDeclarationTexts = localDeclarations.map(
      (declaration) => declaration.text,
    );

    const inlinedModuleDeclarations = this.readRequiredLocalModuleDeclarations(
      input.changesSource,
      localDeclarationTexts,
      changeExpressionIdentifiers,
    );

    this.insertStatementsAtTop(input.workingSource, [
      ...inlinedModuleDeclarations,
      ...localDeclarationTexts,
    ]);
  }

  private readRequiredLocalDeclarations(
    changesSource: SourceFile,
    orderedChanges: ExtractedChange[],
  ): LocalDeclaration[] {
    const declarations = this.readNonClassDeclarations(changesSource, true);
    const declarationByName = new Map(
      declarations.map((declaration) => [declaration.name, declaration]),
    );

    const requiredNames = this.readIdentifiersFromChanges(
      changesSource,
      orderedChanges,
    );
    const selectedNames = this.selectTransitiveDependencies(
      declarationByName,
      requiredNames,
    );

    return declarations.filter((declaration) =>
      selectedNames.has(declaration.name),
    );
  }

  private readRequiredLocalModuleDeclarations(
    changesSource: SourceFile,
    localDeclarationTexts: string[],
    changeExpressionIdentifiers: Set<string>,
  ): string[] {
    if (
      localDeclarationTexts.length === 0 &&
      changeExpressionIdentifiers.size === 0
    ) {
      return [];
    }

    const helperIdentifiers =
      localDeclarationTexts.length > 0
        ? this.readIdentifiersFromStatements(
            changesSource,
            localDeclarationTexts,
            'helpers',
          )
        : new Set<string>();
    for (const identifier of changeExpressionIdentifiers) {
      helperIdentifiers.add(identifier);
    }

    const result: string[] = [];
    const inlinedModulePaths = new Set<string>();
    const seenStatements = new Set<string>();

    for (const importDeclaration of changesSource.getImportDeclarations()) {
      if (!this.isRelativeValueImport(importDeclaration)) {
        continue;
      }

      const moduleSource = importDeclaration.getModuleSpecifierSourceFile();
      if (!moduleSource) {
        continue;
      }

      const importedNames = this.readImportedNamesUsedByHelpers(
        importDeclaration,
        helperIdentifiers,
      );

      if (importedNames.length === 0) {
        continue;
      }

      const modulePath = moduleSource.getFilePath();
      result.push(
        ...this.readInlinedModuleDeclarations({
          moduleSource,
          importedNames,
          inlinedModulePaths,
          seenStatements,
        }),
      );
    }

    return result;
  }

  private readIdentifiersFromChanges(
    source: SourceFile,
    orderedChanges: ExtractedChange[],
  ): Set<string> {
    const snippets: string[] = [];

    for (const change of orderedChanges) {
      if (change.replace) {
        snippets.push(
          `const _replace_${change.changeClassName} = (${change.replace});`,
        );
      }

      for (const [fieldName, schemaText] of change.set.entries()) {
        const safeFieldName = fieldName.replace(/[^A-Za-z0-9_]/g, '_');
        snippets.push(
          `const _set_${change.changeClassName}_${safeFieldName} = (${schemaText});`,
        );
      }
    }

    if (snippets.length === 0) {
      return new Set();
    }

    return this.readIdentifiersFromStatements(
      source,
      snippets,
      'change-expressions',
    );
  }

  private readIdentifiersFromStatements(
    source: SourceFile,
    statements: string[],
    label: string,
  ): Set<string> {
    const tempSource = source
      .getProject()
      .createSourceFile(
        `/versioned-schema-ast.${label}.${Math.random().toString(36).slice(2)}.ts`,
        statements.join('\n'),
        { overwrite: true },
      );

    return new Set(
      tempSource
        .getDescendantsOfKind(SyntaxKind.Identifier)
        .map((identifier) => identifier.getText()),
    );
  }

  private readNonClassDeclarations(
    sourceFile: SourceFile,
    onlyNonExported: boolean,
  ): LocalDeclaration[] {
    const declarations: LocalDeclaration[] = [];

    for (const statement of sourceFile.getStatements()) {
      if (
        Node.isImportDeclaration(statement) ||
        Node.isClassDeclaration(statement)
      ) {
        continue;
      }

      if (
        Node.isVariableStatement(statement) &&
        (!onlyNonExported || !statement.isExported())
      ) {
        for (const declaration of statement.getDeclarations()) {
          declarations.push({
            name: declaration.getName(),
            text: statement.getText(),
            order: declaration.getStart(),
            references: this.readReferencedIdentifiers(
              declaration,
              declaration.getName(),
            ),
          });
        }
      }

      if (
        Node.isTypeAliasDeclaration(statement) &&
        (!onlyNonExported || !statement.isExported())
      ) {
        declarations.push({
          name: statement.getName(),
          text: statement.getText(),
          order: statement.getStart(),
          references: this.readReferencedIdentifiers(
            statement,
            statement.getName(),
          ),
        });
      }

      if (
        Node.isFunctionDeclaration(statement) &&
        (!onlyNonExported || !statement.isExported())
      ) {
        const name = statement.getName();

        if (name) {
          declarations.push({
            name,
            text: statement.getText(),
            order: statement.getStart(),
            references: this.readReferencedIdentifiers(statement, name),
          });
        }
      }

      if (
        Node.isEnumDeclaration(statement) &&
        (!onlyNonExported || !statement.isExported())
      ) {
        declarations.push({
          name: statement.getName(),
          text: statement.getText(),
          order: statement.getStart(),
          references: this.readReferencedIdentifiers(
            statement,
            statement.getName(),
          ),
        });
      }
    }

    return declarations;
  }

  private selectTransitiveDependencies(
    declarationByName: Map<string, LocalDeclaration>,
    requiredNames: Set<string>,
  ): Set<string> {
    const selected = new Set<string>();
    const queue = [...requiredNames];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current || selected.has(current)) {
        continue;
      }

      const declaration = declarationByName.get(current);
      if (!declaration) {
        continue;
      }

      selected.add(current);

      for (const reference of declaration.references) {
        if (!selected.has(reference)) {
          queue.push(reference);
        }
      }
    }

    return selected;
  }

  private readReferencedIdentifiers(node: Node, ownName: string): string[] {
    return node
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .map((identifier) => identifier.getText())
      .filter((name) => name !== ownName);
  }

  private isRelativeValueImport(importDeclaration: ImportDeclaration): boolean {
    return (
      importDeclaration.getModuleSpecifierValue().startsWith('./') &&
      !importDeclaration.isTypeOnly()
    );
  }

  private readImportedNamesUsedByHelpers(
    importDeclaration: ImportDeclaration,
    helperIdentifiers: Set<string>,
  ): string[] {
    const usedImportedNames: string[] = [];

    const defaultImport = importDeclaration.getDefaultImport();
    if (defaultImport) {
      const localName = defaultImport.getText();
      if (helperIdentifiers.has(localName)) {
        usedImportedNames.push(localName);
      }
    }

    for (const namedImport of importDeclaration.getNamedImports()) {
      if (namedImport.isTypeOnly()) {
        continue;
      }

      const importedName = namedImport.getName();
      const localName = namedImport.getAliasNode()?.getText() ?? importedName;

      if (helperIdentifiers.has(localName)) {
        usedImportedNames.push(importedName);
      }
    }

    return usedImportedNames;
  }

  private readInlinedModuleDeclarations(input: {
    moduleSource: SourceFile;
    importedNames: string[];
    inlinedModulePaths: Set<string>;
    seenStatements: Set<string>;
  }): string[] {
    const { moduleSource, importedNames, inlinedModulePaths, seenStatements } =
      input;
    const modulePath = moduleSource.getFilePath();
    if (inlinedModulePaths.has(modulePath)) {
      return [];
    }
    inlinedModulePaths.add(modulePath);

    const allModuleDeclarations = this.readNonClassDeclarations(
      moduleSource,
      false,
    );
    const declarationByName = new Map(
      allModuleDeclarations.map((declaration) => [
        declaration.name,
        declaration,
      ]),
    );
    const requiredNames = this.selectTransitiveDependencies(
      declarationByName,
      new Set(importedNames),
    );

    const selected = allModuleDeclarations
      .filter((declaration) => requiredNames.has(declaration.name))
      .sort((left, right) => left.order - right.order);

    const selectedTexts = selected.map((declaration) =>
      this.stripExportKeyword(declaration.text),
    );
    const helperIdentifiers =
      selectedTexts.length > 0
        ? this.readIdentifiersFromStatements(
            moduleSource,
            selectedTexts,
            `helpers-${Math.random().toString(36).slice(2)}`,
          )
        : new Set<string>();
    const inlinedText: string[] = [];

    for (const importDeclaration of moduleSource.getImportDeclarations()) {
      if (!this.isRelativeValueImport(importDeclaration)) {
        continue;
      }

      const nestedModuleSource = importDeclaration.getModuleSpecifierSourceFile();
      if (!nestedModuleSource) {
        continue;
      }

      const nestedImportedNames = this.readImportedNamesUsedByHelpers(
        importDeclaration,
        helperIdentifiers,
      );

      if (nestedImportedNames.length === 0) {
        continue;
      }

      inlinedText.push(
        ...this.readInlinedModuleDeclarations({
          moduleSource: nestedModuleSource,
          importedNames: nestedImportedNames,
          inlinedModulePaths,
          seenStatements,
        }),
      );
    }

    for (const statementText of selectedTexts) {
      if (seenStatements.has(statementText)) {
        continue;
      }

      seenStatements.add(statementText);
      inlinedText.push(statementText);
    }

    return inlinedText;
  }

  private stripExportKeyword(statementText: string): string {
    return statementText.replace(/^export\s+/, '');
  }

  private insertStatementsAtTop(
    target: SourceFile,
    statements: string[],
  ): void {
    if (statements.length === 0) {
      return;
    }

    const firstNonImportIndex = target
      .getStatements()
      .findIndex((statement) => !Node.isImportDeclaration(statement));

    const insertionIndex =
      firstNonImportIndex === -1
        ? target.getStatements().length
        : firstNonImportIndex;

    target.insertStatements(insertionIndex, statements.join('\n\n'));
  }
}
