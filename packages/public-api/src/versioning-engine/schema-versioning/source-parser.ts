import { existsSync } from "fs";
import { dirname, join, resolve } from "path";

import {
  ArrayLiteralExpression,
  ArrowFunction,
  CallExpression,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Node,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  SourceFile,
  VariableDeclaration,
} from "ts-morph";

import { ChangeType } from "../dsl/changes/version-change";
import { changeHandlers, ChangeParseContext } from "./change-handlers";
import {
  AnyParsedChangeDefinition,
  ParsedChangeDefinition,
  ParsedChangeMetadata,
  ParsedChangePayloadByType,
  ParsedResourceDefinition,
  ParsedSchemaExpression,
  ParsedVersionDefinition,
} from "./types";

export interface VersionSourceParserOptions {
  version: string;
  versionsRootDir: string;
  tsConfigFilePath: string;
}

const CHANGE_NAMES = new Set<ChangeType>([
  "add",
  "remove",
  "rename",
  "replaceSchema",
  "patch",
]);

export class VersionSourceParser {
  public parseVersionDefinition(
    options: VersionSourceParserOptions
  ): ParsedVersionDefinition {
    const definitionFilePath = join(
      options.versionsRootDir,
      options.version,
      `${options.version}.ts`
    );

    if (!existsSync(definitionFilePath)) {
      throw new Error(
        `Missing version definition source file: ${definitionFilePath}`
      );
    }

    const project = new Project({
      compilerOptions: {
        noEmit: true,
      },
      skipAddingFilesFromTsConfig: true,
      tsConfigFilePath: options.tsConfigFilePath,
    });
    const definitionFile =
      project.addSourceFileAtPathIfExists(definitionFilePath);

    if (!definitionFile) {
      throw new Error(`Cannot load source file ${definitionFilePath}`);
    }

    const definitionCall = this.readDefaultExportCall(
      definitionFile,
      "defineVersion"
    );
    const definitionObject = this.readObjectArgument(
      definitionCall,
      0,
      "defineVersion(...)"
    );
    const version = this.readRequiredStringProperty(
      definitionObject,
      "version"
    );

    if (version !== options.version) {
      throw new Error(
        `Version mismatch in ${definitionFilePath}: file defines ${version} but CLI requested ${options.version}`
      );
    }

    return {
      baseVersion: this.readRequiredStringProperty(
        definitionObject,
        "baseVersion"
      ),
      description:
        this.readOptionalStringProperty(definitionObject, "description") ?? "",
      resources: this.readRequiredArrayProperty(definitionObject, "resources")
        .getElements()
        .map((resourceNode, index) =>
          this.parseResourceDefinitionEntry(
            resourceNode,
            index,
            definitionFile.getFilePath()
          )
        ),
      sourceFilePath: definitionFile.getFilePath(),
      version,
    };
  }

  private parseResourceDefinitionEntry(
    resourceNode: Node,
    resourceIndex: number,
    sourceFilePath: string
  ): ParsedResourceDefinition {
    const resourceCall = this.readNamedCall(
      resourceNode,
      "resource",
      `Resource entry at index ${resourceIndex} in ${sourceFilePath}`
    );
    const resourceName = this.readStringLiteralArgument(
      resourceCall,
      0,
      `resource(...) at index ${resourceIndex} in ${sourceFilePath}`
    );
    const resourceOptions = this.readResourceOptionsObject(
      resourceCall,
      resourceName
    );

    return {
      changes: this.readResourceChangesArray(resourceOptions, resourceName)
        .getElements()
        .flatMap((changeNode, changeIndex) =>
          this.parseChangeDefinition(changeNode, resourceName, changeIndex)
        ),
      contextProvider: this.readResourceContextProvider(resourceOptions),
      kind: this.readResourceKind(resourceOptions),
      resourceName,
    };
  }

  private parseChangeDefinition(
    changeNode: Node,
    resourceName: string,
    changeIndex: number
  ): AnyParsedChangeDefinition[] {
    const changeCall = this.readCallExpression(
      changeNode,
      `Change at index ${changeIndex} for resource ${resourceName}`
    );
    const changeType = this.getCallName(changeCall);

    if (!CHANGE_NAMES.has(changeType as ChangeType)) {
      throw new Error(
        `Unsupported change helper ${changeCall.getText()} for resource ${resourceName}`
      );
    }

    const payloadObject = this.readObjectArgument(
      changeCall,
      0,
      `${changeType}(...) for resource ${resourceName}`
    );

    if (changeType === "patch") {
      return this.parsePatchGroupDefinitions(
        payloadObject,
        resourceName,
        changeIndex,
        changeCall.getSourceFile().getFilePath()
      );
    }

    const parsedChange = this.createParsedChangeDefinition(
      `${resourceName}:${changeType}#${changeIndex + 1}`,
      changeType as ChangeType,
      this.parseChangePayloadByType(
        changeType as ChangeType,
        payloadObject,
        changeCall.getSourceFile().getFilePath(),
        resourceName
      ),
      this.readChangeMetadata(payloadObject),
      changeCall.getSourceFile().getFilePath()
    );

    return [parsedChange as AnyParsedChangeDefinition];
  }

  private parsePatchGroupDefinitions(
    groupPayloadObject: ObjectLiteralExpression,
    resourceName: string,
    groupIndex: number,
    sourceFilePath: string
  ): AnyParsedChangeDefinition[] {
    this.readRequiredStringProperty(groupPayloadObject, "payloadPath");

    const groupTitle = this.readOptionalStringProperty(
      groupPayloadObject,
      "title"
    );
    const groupMetadata = this.readChangeMetadata(groupPayloadObject);

    return this.readRequiredArrayProperty(groupPayloadObject, "changes")
      .getElements()
      .map((changeNode, childIndex) => {
        const changeCall = this.readCallExpression(
          changeNode,
          `Change at index ${childIndex} in patch group ${
            groupTitle ?? groupIndex + 1
          } for resource ${resourceName}`
        );
        const changeType = this.getCallName(changeCall);

        if (!CHANGE_NAMES.has(changeType as ChangeType)) {
          throw new Error(
            `Unsupported change helper ${changeCall.getText()} for patch group ${
              groupTitle ?? groupIndex + 1
            }`
          );
        }

        if (changeType === "patch") {
          throw new Error(
            `patch group ${
              groupTitle ?? groupIndex + 1
            } cannot contain nested patch changes`
          );
        }

        const payloadObject = this.readObjectArgument(
          changeCall,
          0,
          `${changeType}(...) in patch group ${groupTitle ?? groupIndex + 1}`
        );
        const childMetadata = this.readChangeMetadata(payloadObject);

        return this.createParsedChangeDefinition(
          `${resourceName}:${
            groupTitle ?? `patch#${groupIndex + 1}`
          }:${changeType}#${childIndex + 1}`,
          changeType as ChangeType,
          this.parseChangePayloadByType(
            changeType as ChangeType,
            payloadObject,
            sourceFilePath,
            resourceName
          ),
          this.mergeChangeMetadata(groupMetadata, childMetadata, groupTitle),
          sourceFilePath
        ) as AnyParsedChangeDefinition;
      });
  }

  private readResourceChangesArray(
    resourceOptions: ObjectLiteralExpression,
    resourceName: string
  ): ArrayLiteralExpression {
    const contextLabel = `resource("${resourceName}", ...)`;
    const changesProperty = this.readRequiredPropertyInitializer(
      resourceOptions,
      "changes"
    );

    return this.readChangesArrayFromNode(
      changesProperty,
      `${contextLabel} changes`
    );
  }

  private readChangesArrayFromNode(
    node: Node | undefined,
    contextLabel: string
  ): ArrayLiteralExpression {
    if (Node.isArrayLiteralExpression(node)) {
      return node;
    }

    if (Node.isArrowFunction(node) || Node.isFunctionExpression(node)) {
      return this.readChangesArrayFromFactory(node, contextLabel);
    }

    if (Node.isIdentifier(node)) {
      return this.readChangesArrayFromIdentifier(node, contextLabel);
    }

    throw new Error(
      `${contextLabel} must be a change array, a change factory, or a resolvable changes identifier`
    );
  }

  private readChangesArrayFromFactory(
    factory: ArrowFunction | FunctionExpression,
    contextLabel: string
  ): ArrayLiteralExpression {
    const body = factory.getBody();

    if (Node.isArrayLiteralExpression(body)) {
      return body;
    }

    if (Node.isBlock(body)) {
      const returnStatement = body.getStatements().find(Node.isReturnStatement);
      const expression = returnStatement?.getExpression();

      if (expression && Node.isArrayLiteralExpression(expression)) {
        return expression;
      }
    }

    throw new Error(
      `${contextLabel} change factory must return an array literal`
    );
  }

  private readChangesArrayFromIdentifier(
    identifier: Identifier,
    contextLabel: string
  ): ArrayLiteralExpression {
    const declaration = this.resolveIdentifierDeclaration(
      identifier,
      contextLabel
    );

    if (Node.isVariableDeclaration(declaration)) {
      return this.readChangesArrayFromNode(
        declaration.getInitializer(),
        `${contextLabel} identifier ${identifier.getText()}`
      );
    }

    if (Node.isFunctionDeclaration(declaration)) {
      return this.readChangesArrayFromFunctionDeclaration(
        declaration,
        `${contextLabel} identifier ${identifier.getText()}`
      );
    }

    throw new Error(
      `${contextLabel} identifier ${identifier.getText()} must resolve to a changes array or factory`
    );
  }

  private readChangesArrayFromFunctionDeclaration(
    declaration: FunctionDeclaration,
    contextLabel: string
  ): ArrayLiteralExpression {
    const body = declaration.getBody();

    if (!body || !Node.isBlock(body)) {
      throw new Error(
        `${contextLabel} change factory must return an array literal`
      );
    }

    const returnStatement = body.getStatements().find(Node.isReturnStatement);
    const expression = returnStatement?.getExpression();

    if (expression && Node.isArrayLiteralExpression(expression)) {
      return expression;
    }

    throw new Error(
      `${contextLabel} change factory must return an array literal`
    );
  }

  private parseChangePayloadByType<TType extends ChangeType>(
    changeType: TType,
    payloadObject: ObjectLiteralExpression,
    sourceFilePath: string,
    resourceName: string
  ): ParsedChangePayloadByType[TType] {
    return changeHandlers[changeType].parsePayload(
      this.createParseContext(
        payloadObject,
        `${resourceName} ${changeType} in ${sourceFilePath}`
      )
    ) as ParsedChangePayloadByType[TType];
  }

  private createParsedChangeDefinition<TType extends ChangeType>(
    changeName: string,
    changeType: TType,
    payload: ParsedChangePayloadByType[TType],
    metadata: ParsedChangeMetadata,
    sourceFilePath: string
  ): ParsedChangeDefinition<TType> {
    return {
      changeName,
      metadata,
      payload,
      sourceFilePath,
      type: changeType,
    };
  }

  private createParseContext(
    payloadObject: ObjectLiteralExpression,
    contextLabel: string
  ): ChangeParseContext {
    return {
      contextLabel,
      payloadObject,
      payloadPath: this.readRequiredStringProperty(
        payloadObject,
        "payloadPath"
      ),
      readOptionalObjectProperty: (objectLiteral, propertyName) =>
        this.readOptionalObjectProperty(objectLiteral, propertyName),
      readOptionalStringProperty: (objectLiteral, propertyName) =>
        this.readOptionalStringProperty(objectLiteral, propertyName),
      readRequiredObjectProperty: (objectLiteral, propertyName) =>
        this.readRequiredObjectProperty(objectLiteral, propertyName),
      readRequiredSchemaExpression: (objectLiteral, propertyName) =>
        this.readRequiredSchemaExpression(objectLiteral, propertyName),
      readRequiredStringArrayProperty: (objectLiteral, propertyName) =>
        this.readRequiredStringArrayProperty(objectLiteral, propertyName),
      readRequiredStringProperty: (objectLiteral, propertyName) =>
        this.readRequiredStringProperty(objectLiteral, propertyName),
      readSchemaExpressionRecord: (objectLiteral, contextLabel) =>
        this.readSchemaExpressionRecord(objectLiteral, contextLabel),
    };
  }

  private readDefaultExportCall(
    sourceFile: SourceFile,
    expectedCallName: string
  ): CallExpression {
    const defaultExport = sourceFile
      .getExportAssignments()
      .find((assignment) => !assignment.isExportEquals());

    if (!defaultExport) {
      throw new Error(
        `Missing default export ${expectedCallName}(...) in ${sourceFile.getFilePath()}`
      );
    }

    return this.readNamedCall(
      defaultExport.getExpression(),
      expectedCallName,
      `Default export in ${sourceFile.getFilePath()}`
    );
  }

  private readNamedCall(
    node: Node | undefined,
    expectedName: string,
    contextLabel: string
  ): CallExpression {
    const callExpression = this.readCallExpression(node, contextLabel);

    if (this.getCallName(callExpression) !== expectedName) {
      throw new Error(
        `${contextLabel} must call ${expectedName}(...), got ${callExpression.getText()}`
      );
    }

    return callExpression;
  }

  private readCallExpression(
    node: Node | undefined,
    contextLabel: string
  ): CallExpression {
    if (!node || !Node.isCallExpression(node)) {
      throw new Error(`${contextLabel} must be a call expression`);
    }

    return node;
  }

  private readObjectArgument(
    callExpression: CallExpression,
    argumentIndex: number,
    contextLabel: string
  ): ObjectLiteralExpression {
    return this.requireObjectLiteral(
      callExpression.getArguments()[argumentIndex],
      `${contextLabel} requires an object literal argument`
    );
  }

  private readStringLiteralArgument(
    callExpression: CallExpression,
    argumentIndex: number,
    contextLabel: string
  ): string {
    return this.requireStringLiteral(
      callExpression.getArguments()[argumentIndex],
      `${contextLabel} must use a string literal`
    ).getLiteralText();
  }

  private readRequiredArrayProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ArrayLiteralExpression {
    return this.requireArrayLiteral(
      this.readRequiredPropertyInitializer(objectLiteral, propertyName),
      this.createPropertyKindErrorMessage(
        objectLiteral,
        propertyName,
        "an array literal"
      )
    );
  }

  private readRequiredObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ObjectLiteralExpression {
    return this.requireObjectLiteral(
      this.readRequiredPropertyInitializer(objectLiteral, propertyName),
      this.createPropertyKindErrorMessage(
        objectLiteral,
        propertyName,
        "an object literal"
      )
    );
  }

  private readOptionalObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ObjectLiteralExpression | undefined {
    return this.readOptionalPropertyInitializerAs(
      objectLiteral,
      propertyName,
      this.requireObjectLiteral,
      "an object literal"
    );
  }

  private readRequiredStringProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string {
    return this.requireStringLiteral(
      this.readRequiredPropertyInitializer(objectLiteral, propertyName),
      this.createPropertyKindErrorMessage(
        objectLiteral,
        propertyName,
        "a string literal"
      )
    ).getLiteralText();
  }

  private readOptionalStringProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string | undefined {
    return this.readOptionalPropertyInitializerAs(
      objectLiteral,
      propertyName,
      this.requireStringLiteral,
      "a string literal"
    )?.getLiteralText();
  }

  private readRequiredStringArrayProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string[] {
    return this.readRequiredArrayProperty(objectLiteral, propertyName)
      .getElements()
      .map((elementNode) =>
        this.requireStringLiteral(
          elementNode,
          `${propertyName} array entries must be string literals in ${objectLiteral
            .getSourceFile()
            .getFilePath()}`
        ).getLiteralText()
      );
  }

  private readChangeMetadata(
    objectLiteral: ObjectLiteralExpression
  ): ParsedChangeMetadata {
    const impact = this.readOptionalStringProperty(objectLiteral, "impact");

    return {
      description: this.readOptionalStringProperty(
        objectLiteral,
        "description"
      ),
      impact: impact as ParsedChangeMetadata["impact"],
      title: this.readOptionalStringProperty(objectLiteral, "title"),
    };
  }

  private mergeChangeMetadata(
    groupMetadata: ParsedChangeMetadata,
    childMetadata: ParsedChangeMetadata,
    groupTitle: string | undefined
  ): ParsedChangeMetadata {
    return {
      description: childMetadata.description ?? groupMetadata.description,
      groupTitle,
      impact: childMetadata.impact ?? groupMetadata.impact,
      title: childMetadata.title ?? groupMetadata.title,
    };
  }

  private readRequiredSchemaExpression(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ParsedSchemaExpression {
    return this.readSchemaExpressionFromNode(
      this.readRequiredPropertyInitializer(objectLiteral, propertyName),
      `${propertyName} in ${objectLiteral.getSourceFile().getFilePath()}`
    );
  }

  private readSchemaExpressionRecord(
    objectLiteral: ObjectLiteralExpression,
    contextLabel: string
  ): Record<string, ParsedSchemaExpression> {
    return Object.fromEntries(
      objectLiteral.getProperties().map((propertyNode) => {
        const propertyAssignment = this.readPropertyAssignment(
          propertyNode,
          `${contextLabel} supports property assignments only`
        );
        const propertyName = this.getPropertyName(propertyAssignment);

        return [
          propertyName,
          this.readSchemaExpressionFromNode(
            propertyAssignment.getInitializer(),
            `${contextLabel}.${propertyName}`
          ),
        ] as const;
      })
    );
  }

  private readRequiredPropertyInitializer(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): Expression {
    const initializer = this.getRequiredPropertyAssignment(
      objectLiteral,
      propertyName
    ).getInitializer();

    if (!initializer) {
      throw new Error(
        `Missing initializer for property "${propertyName}" in ${objectLiteral
          .getSourceFile()
          .getFilePath()}`
      );
    }

    return initializer;
  }

  private readOptionalPropertyInitializerAs<TNode extends Expression>(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    reader: (node: Node | undefined, errorMessage: string) => TNode,
    expectedKindLabel: string
  ): TNode | undefined {
    const property = this.getOptionalPropertyAssignment(
      objectLiteral,
      propertyName
    );
    if (!property) {
      return undefined;
    }

    return reader.call(
      this,
      property.getInitializer(),
      this.createPropertyKindErrorMessage(
        objectLiteral,
        propertyName,
        expectedKindLabel
      )
    );
  }

  private readSchemaExpressionFromNode(
    expression: Node | undefined,
    contextLabel: string
  ): ParsedSchemaExpression {
    if (expression && Node.isIdentifier(expression)) {
      const declaration = this.resolveIdentifierDeclaration(
        expression,
        contextLabel
      );
      const initializer = Node.isVariableDeclaration(declaration)
        ? declaration.getInitializer()
        : undefined;

      if (!initializer) {
        throw new Error(
          `${contextLabel} schema identifiers must reference a local const initialized with schema(...)`
        );
      }

      return this.readSchemaExpressionFromNode(
        initializer,
        `${contextLabel} identifier ${expression.getText()}`
      );
    }

    const schemaCall = this.readNamedCall(expression, "schema", contextLabel);
    const schemaExpression = schemaCall.getArguments()[0];

    if (!schemaExpression || !Node.isExpression(schemaExpression)) {
      throw new Error(`${contextLabel} schema(...) requires an expression`);
    }

    return {
      sourceFilePath: schemaExpression.getSourceFile().getFilePath(),
      text: schemaExpression.getText(),
    };
  }

  private getRequiredPropertyAssignment(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): PropertyAssignment {
    const property = this.getOptionalPropertyAssignment(
      objectLiteral,
      propertyName
    );

    if (!property) {
      throw new Error(
        `Missing required property "${propertyName}" in ${objectLiteral
          .getSourceFile()
          .getFilePath()}`
      );
    }

    return property;
  }

  private getOptionalPropertyAssignment(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): PropertyAssignment | undefined {
    return objectLiteral
      .getProperties()
      .find(
        (propertyNode) =>
          Node.isPropertyAssignment(propertyNode) &&
          this.getPropertyName(propertyNode) === propertyName
      ) as PropertyAssignment | undefined;
  }

  private resolveIdentifierDeclaration(
    identifier: Identifier,
    contextLabel: string
  ): VariableDeclaration | FunctionDeclaration {
    const identifierName = identifier.getText();
    const sourceFile = identifier.getSourceFile();
    const localVariable = sourceFile.getVariableDeclaration(identifierName);

    if (localVariable) {
      return localVariable;
    }

    const localFunction = sourceFile.getFunction(identifierName);

    if (localFunction) {
      return localFunction;
    }

    for (const importDeclaration of sourceFile.getImportDeclarations()) {
      const namedImport = importDeclaration
        .getNamedImports()
        .find(
          (specifier) =>
            (specifier.getAliasNode()?.getText() ?? specifier.getName()) ===
            identifierName
        );

      if (namedImport) {
        const importedSourceFile = this.resolveImportSourceFile(
          sourceFile,
          importDeclaration.getModuleSpecifierValue(),
          contextLabel
        );
        const importedName = namedImport.getName();
        const importedVariable =
          importedSourceFile.getVariableDeclaration(importedName);

        if (importedVariable) {
          return importedVariable;
        }

        const importedFunction = importedSourceFile.getFunction(importedName);

        if (importedFunction) {
          return importedFunction;
        }
      }

      const defaultImport = importDeclaration.getDefaultImport();

      if (defaultImport?.getText() === identifierName) {
        throw new Error(
          `${contextLabel} identifier ${identifierName} uses a default import; use a named export instead`
        );
      }
    }

    throw new Error(
      `${contextLabel} cannot resolve identifier ${identifierName}`
    );
  }

  private resolveImportSourceFile(
    sourceFile: SourceFile,
    moduleSpecifier: string,
    contextLabel: string
  ): SourceFile {
    if (!moduleSpecifier.startsWith(".")) {
      throw new Error(
        `${contextLabel} cannot resolve non-relative import ${moduleSpecifier}`
      );
    }

    const absoluteImportPath = resolve(
      dirname(sourceFile.getFilePath()),
      moduleSpecifier
    );
    const candidatePaths = [
      absoluteImportPath,
      `${absoluteImportPath}.ts`,
      join(absoluteImportPath, "index.ts"),
    ];
    const project = sourceFile.getProject();
    const importedSourceFile = candidatePaths
      .map((candidatePath) =>
        project.addSourceFileAtPathIfExists(candidatePath)
      )
      .find((candidateSourceFile): candidateSourceFile is SourceFile =>
        Boolean(candidateSourceFile)
      );

    if (!importedSourceFile) {
      throw new Error(
        `${contextLabel} cannot resolve import ${moduleSpecifier} from ${sourceFile.getFilePath()}`
      );
    }

    return importedSourceFile;
  }

  private readResourceOptionsObject(
    resourceCall: CallExpression,
    resourceName: string
  ): ObjectLiteralExpression {
    return this.requireObjectLiteral(
      resourceCall.getArguments()[1],
      `resource("${resourceName}", ...) requires an options object literal`
    );
  }

  private readResourceKind(
    resourceOptions: ObjectLiteralExpression
  ): ParsedResourceDefinition["kind"] {
    const kind = this.readRequiredStringProperty(resourceOptions, "kind");

    if (kind !== "request" && kind !== "response") {
      throw new Error(`resource kind must be request or response, got ${kind}`);
    }

    return kind;
  }

  private readResourceContextProvider(
    resourceOptions: ObjectLiteralExpression
  ): string | undefined {
    return this.getOptionalPropertyAssignment(
      resourceOptions,
      "contextProvider"
    )
      ?.getInitializer()
      ?.getText();
  }

  private readPropertyAssignment(
    node: Node,
    errorMessage: string
  ): PropertyAssignment {
    if (!Node.isPropertyAssignment(node)) {
      throw new Error(errorMessage);
    }

    return node;
  }

  private createPropertyKindErrorMessage(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    expectedKindLabel: string
  ): string {
    return `${propertyName} must be ${expectedKindLabel} in ${objectLiteral
      .getSourceFile()
      .getFilePath()}`;
  }

  private requireArrayLiteral(
    node: Node | undefined,
    errorMessage: string
  ): ArrayLiteralExpression {
    if (!node || !Node.isArrayLiteralExpression(node)) {
      throw new Error(errorMessage);
    }

    return node;
  }

  private requireObjectLiteral(
    node: Node | undefined,
    errorMessage: string
  ): ObjectLiteralExpression {
    if (!node || !Node.isObjectLiteralExpression(node)) {
      throw new Error(errorMessage);
    }

    return node;
  }

  private requireStringLiteral(node: Node | undefined, errorMessage: string) {
    if (!node || !Node.isStringLiteral(node)) {
      throw new Error(errorMessage);
    }

    return node;
  }

  private getCallName(callExpression: CallExpression): string {
    const expression = callExpression.getExpression();

    if (Node.isIdentifier(expression)) {
      return expression.getText();
    }

    if (Node.isPropertyAccessExpression(expression)) {
      return expression.getName();
    }

    return expression.getText();
  }

  private getPropertyName(propertyAssignment: PropertyAssignment): string {
    const propertyNameNode = propertyAssignment.getNameNode();

    if (Node.isIdentifier(propertyNameNode)) {
      return propertyNameNode.getText();
    }

    if (Node.isStringLiteral(propertyNameNode)) {
      return propertyNameNode.getLiteralText();
    }

    if (Node.isNumericLiteral(propertyNameNode)) {
      return propertyNameNode.getLiteralText();
    }

    throw new Error(
      `Unsupported property key ${propertyNameNode.getText()} in ${propertyAssignment
        .getSourceFile()
        .getFilePath()}`
    );
  }
}
