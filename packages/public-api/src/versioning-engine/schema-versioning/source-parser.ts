import { existsSync } from "fs";
import { join } from "path";

import {
  ArrayLiteralExpression,
  CallExpression,
  Expression,
  Node,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  SourceFile,
} from "ts-morph";

import { ChangeType } from "../dsl/version-change";
import { changeHandlers, ChangeParseContext } from "./change-handlers";
import {
  AnyParsedChangeDefinition,
  ParsedChangeDefinition,
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
  "merge",
  "split",
  "custom",
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

    return {
      changes: this.readArrayArgument(
        resourceCall,
        1,
        `resource("${resourceName}", ...)`
      )
        .getElements()
        .map((changeNode, changeIndex) =>
          this.parseChangeDefinition(changeNode, resourceName, changeIndex)
        ),
      resourceName,
    };
  }

  private parseChangeDefinition(
    changeNode: Node,
    resourceName: string,
    changeIndex: number
  ): AnyParsedChangeDefinition {
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

    const parsedChange = this.createParsedChangeDefinition(
      `${resourceName}:${changeType}#${changeIndex + 1}`,
      changeType as ChangeType,
      this.parseChangePayloadByType(
        changeType as ChangeType,
        this.readObjectArgument(
          changeCall,
          0,
          `${changeType}(...) for resource ${resourceName}`
        ),
        changeCall.getSourceFile().getFilePath(),
        resourceName
      ),
      changeCall.getSourceFile().getFilePath()
    );

    return parsedChange as AnyParsedChangeDefinition;
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
    sourceFilePath: string
  ): ParsedChangeDefinition<TType> {
    return {
      changeName,
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

  private readArrayArgument(
    callExpression: CallExpression,
    argumentIndex: number,
    contextLabel: string
  ): ArrayLiteralExpression {
    return this.requireArrayLiteral(
      callExpression.getArguments()[argumentIndex],
      `${contextLabel} requires an array literal argument`
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
