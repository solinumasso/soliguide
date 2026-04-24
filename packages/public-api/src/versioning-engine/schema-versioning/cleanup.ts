import {
  ImportDeclaration,
  SourceFile,
  VariableDeclaration,
  VariableStatement,
} from "ts-morph";

export function pruneUnusedDeclarations(sourceFile: SourceFile): void {
  let hasChanges = true;

  while (hasChanges) {
    hasChanges = false;

    if (pruneUnusedImports(sourceFile)) {
      hasChanges = true;
    }

    if (pruneUnusedTopLevelVariables(sourceFile)) {
      hasChanges = true;
    }

    if (pruneUnusedTopLevelTypes(sourceFile)) {
      hasChanges = true;
    }
  }
}

function pruneUnusedImports(sourceFile: SourceFile): boolean {
  let hasChanges = false;

  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    if (removeUnusedImportBindings(sourceFile, importDeclaration)) {
      hasChanges = true;
    }
  }

  return hasChanges;
}

function removeUnusedImportBindings(
  sourceFile: SourceFile,
  importDeclaration: ImportDeclaration
): boolean {
  let hasChanges = false;

  for (const namedImport of importDeclaration.getNamedImports()) {
    const bindingName =
      namedImport.getAliasNode()?.getText() ?? namedImport.getName();

    if (countIdentifierUsages(sourceFile, bindingName) <= 1) {
      namedImport.remove();
      hasChanges = true;
    }
  }

  const defaultImport = importDeclaration.getDefaultImport();
  if (
    defaultImport &&
    countIdentifierUsages(sourceFile, defaultImport.getText()) <= 1
  ) {
    importDeclaration.removeDefaultImport();
    hasChanges = true;
  }

  const namespaceImport = importDeclaration.getNamespaceImport();
  if (
    namespaceImport &&
    countIdentifierUsages(sourceFile, namespaceImport.getText()) <= 1
  ) {
    importDeclaration.removeNamespaceImport();
    hasChanges = true;
  }

  if (
    importDeclaration.getNamedImports().length === 0 &&
    !importDeclaration.getDefaultImport() &&
    !importDeclaration.getNamespaceImport()
  ) {
    importDeclaration.remove();
    hasChanges = true;
  }

  return hasChanges;
}

function pruneUnusedTopLevelVariables(sourceFile: SourceFile): boolean {
  let hasChanges = false;

  for (const variableStatement of sourceFile.getVariableStatements()) {
    if (variableStatement.isExported()) {
      continue;
    }

    const variableDeclarations = variableStatement.getDeclarations();
    for (const variableDeclaration of variableDeclarations) {
      if (isUnusedVariable(sourceFile, variableDeclaration)) {
        removeVariableDeclaration(variableStatement, variableDeclaration);
        hasChanges = true;
      }
    }
  }

  return hasChanges;
}

function isUnusedVariable(
  sourceFile: SourceFile,
  variableDeclaration: VariableDeclaration
): boolean {
  return countIdentifierUsages(sourceFile, variableDeclaration.getName()) <= 1;
}

function removeVariableDeclaration(
  variableStatement: VariableStatement,
  variableDeclaration: VariableDeclaration
): void {
  if (variableStatement.getDeclarations().length === 1) {
    variableStatement.remove();
    return;
  }

  variableDeclaration.remove();
}

function pruneUnusedTopLevelTypes(sourceFile: SourceFile): boolean {
  let hasChanges = false;

  for (const typeAlias of sourceFile.getTypeAliases()) {
    if (typeAlias.isExported()) {
      continue;
    }

    if (countIdentifierUsages(sourceFile, typeAlias.getName()) <= 1) {
      typeAlias.remove();
      hasChanges = true;
    }
  }

  for (const interfaceDeclaration of sourceFile.getInterfaces()) {
    if (interfaceDeclaration.isExported()) {
      continue;
    }

    if (
      countIdentifierUsages(sourceFile, interfaceDeclaration.getName()) <= 1
    ) {
      interfaceDeclaration.remove();
      hasChanges = true;
    }
  }

  return hasChanges;
}

function countIdentifierUsages(
  sourceFile: SourceFile,
  identifier: string
): number {
  const sourceText = sourceFile.getFullText();
  const escapedIdentifier = escapeRegExp(identifier);
  const usageRegex = new RegExp(`\\b${escapedIdentifier}\\b`, "g");
  const matches = sourceText.match(usageRegex);

  return matches?.length ?? 0;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
