import {
  CallExpression,
  Expression,
  Node,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
  VariableDeclaration,
} from "ts-morph";

import { changeHandlers, ChangeApplyContext } from "./change-handlers";
import { AnyParsedChangeDefinition } from "./types";

const OBJECT_METHOD_NAMES = new Set(["object", "looseObject", "strictObject"]);
const ARRAY_METHOD_NAMES = new Set(["array"]);
const UNSUPPORTED_TYPED_TRAVERSAL_METHOD_NAMES = new Set([
  "discriminatedUnion",
  "union",
  "intersection",
  "record",
  "map",
  "set",
  "tuple",
]);
const WRAPPER_METHOD_NAMES = new Set([
  "and",
  "brand",
  "catchall",
  "default",
  "describe",
  "meta",
  "nullable",
  "nullish",
  "optional",
  "pipe",
  "readonly",
  "refine",
  "superRefine",
  "transform",
]);

export interface ApplySchemaChangesOptions {
  sourceFilePath: string;
  changes: AnyParsedChangeDefinition[];
}

interface SchemaMethodCall {
  callExpression: CallExpression;
  methodName: string;
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

    const mainSchemaDeclaration =
      this.findMainExportedSchemaDeclaration(sourceFile);
    const applyContext = this.createApplyContext(
      sourceFile,
      mainSchemaDeclaration
    );

    for (const change of orderChangesForBaseSchemaPaths(options.changes)) {
      this.applyChange(applyContext, change);
    }

    this.ensureMainSchemaFooter(sourceFile, mainSchemaDeclaration.getName());

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
    const mainSchemaName =
      mainSchemaVariableName ??
      this.findMainExportedSchemaDeclaration(sourceFile).getName();
    const typeAliasName = `V${mainSchemaName.slice(1)}`.replace(/Schema$/, "");

    const typeAlias = sourceFile.getTypeAlias(typeAliasName);
    if (!typeAlias) {
      sourceFile.addTypeAlias({
        isExported: true,
        name: typeAliasName,
        type: `z.infer<typeof ${mainSchemaName}>`,
      });
    }

    const defaultExportAssignment = sourceFile
      .getExportAssignments()
      .find((assignment) => !assignment.isExportEquals());

    if (!defaultExportAssignment) {
      sourceFile.addExportAssignment({
        expression: mainSchemaName,
      });
      return;
    }

    const defaultExpression = defaultExportAssignment.getExpression();
    if (!defaultExpression || defaultExpression.getText() !== mainSchemaName) {
      defaultExportAssignment.setExpression(mainSchemaName);
    }
  }

  private applyChange(
    context: ChangeApplyContext,
    change: AnyParsedChangeDefinition
  ): void {
    changeHandlers[change.type].apply(context, change as never);
  }

  private createApplyContext(
    sourceFile: SourceFile,
    mainSchemaDeclaration: VariableDeclaration
  ): ChangeApplyContext {
    return {
      addObjectProperty: (objectLiteral, propertyName, initializer) =>
        this.addObjectProperty(objectLiteral, propertyName, initializer),
      assertPropertyMissing: (objectLiteral, propertyName, errorMessage) =>
        this.assertPropertyMissing(objectLiteral, propertyName, errorMessage),
      mainSchemaDeclaration,
      readPropertyInitializer: (property, errorMessage) =>
        this.readPropertyInitializer(property, errorMessage),
      requireObjectProperty: (objectLiteral, propertyName, errorMessage) =>
        this.requireObjectProperty(objectLiteral, propertyName, errorMessage),
      resolveChangeFieldProperty: (schemaDeclaration, payloadPath, context) =>
        this.resolveChangeFieldProperty(
          schemaDeclaration,
          payloadPath,
          context
        ),
      resolveChangeObject: (schemaDeclaration, payloadPath, context) =>
        this.resolveChangeObject(schemaDeclaration, payloadPath, context),
      setOrAddObjectProperty: (objectLiteral, propertyName, initializer) =>
        this.setOrAddObjectProperty(objectLiteral, propertyName, initializer),
      sourceFile,
    };
  }

  private resolveChangeFieldProperty(
    mainSchemaDeclaration: VariableDeclaration,
    payloadPath: string,
    context: string
  ): PropertyAssignment {
    return this.resolveFieldPropertyAtPath(
      mainSchemaDeclaration,
      splitPayloadPath(payloadPath),
      context
    );
  }

  private resolveChangeObject(
    mainSchemaDeclaration: VariableDeclaration,
    payloadPath: string,
    context: string
  ): ObjectLiteralExpression {
    return this.resolveObjectAtPath(
      mainSchemaDeclaration,
      splitPayloadPath(payloadPath),
      context
    );
  }

  private requireObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    errorMessage: string
  ): PropertyAssignment {
    const property = this.getObjectProperty(objectLiteral, propertyName);
    if (!property) {
      throw new Error(errorMessage);
    }

    return property;
  }

  private assertPropertyMissing(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    errorMessage: string
  ): void {
    if (this.getObjectProperty(objectLiteral, propertyName)) {
      throw new Error(errorMessage);
    }
  }

  private addObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    initializer: string
  ): void {
    objectLiteral.addPropertyAssignment({
      initializer,
      name: propertyName,
    });
  }

  private setOrAddObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    initializer: string
  ): void {
    const existingProperty = this.getObjectProperty(
      objectLiteral,
      propertyName
    );
    if (existingProperty) {
      existingProperty.setInitializer(initializer);
      return;
    }

    this.addObjectProperty(objectLiteral, propertyName, initializer);
  }

  private readPropertyInitializer(
    property: PropertyAssignment,
    errorMessage: string
  ): Expression {
    const initializer = property.getInitializer();
    if (!initializer) {
      throw new Error(errorMessage);
    }

    return initializer;
  }

  private resolveFieldPropertyAtPath(
    mainSchemaDeclaration: VariableDeclaration,
    pathSegments: string[],
    context: string
  ): PropertyAssignment {
    if (pathSegments.length === 0) {
      throw new Error(`Invalid empty payloadPath for ${context}`);
    }

    const fieldName = pathSegments[pathSegments.length - 1];
    const parentPathSegments = pathSegments.slice(0, -1);
    const parentObject = this.resolveObjectAtPath(
      mainSchemaDeclaration,
      parentPathSegments,
      context
    );

    return this.requireObjectProperty(
      parentObject,
      fieldName,
      `Invalid payloadPath ${pathSegments.join(
        "."
      )} for ${context}: field ${fieldName} not found`
    );
  }

  private resolveObjectAtPath(
    mainSchemaDeclaration: VariableDeclaration,
    pathSegments: string[],
    context: string
  ): ObjectLiteralExpression {
    let currentExpression = mainSchemaDeclaration.getInitializer();
    if (!currentExpression) {
      throw new Error(
        `Missing initializer for main schema ${mainSchemaDeclaration.getName()} in ${mainSchemaDeclaration
          .getSourceFile()
          .getFilePath()}`
      );
    }

    for (const segment of pathSegments) {
      const currentObjectShape = this.resolveObjectShapeFromSchemaExpression(
        currentExpression,
        `${context} (${segment})`
      );
      const property = this.requireObjectProperty(
        currentObjectShape,
        segment,
        `Invalid payloadPath ${pathSegments.join(
          "."
        )} for ${context}: segment ${segment} not found`
      );

      currentExpression = this.readPropertyInitializer(
        property,
          `Property ${segment} in ${pathSegments.join(
            "."
          )} for ${context} has no initializer`
      );
    }

    return this.resolveObjectShapeFromSchemaExpression(
      currentExpression,
      context
    );
  }

  private resolveObjectShapeFromSchemaExpression(
    schemaExpression: Expression,
    context: string,
    visitedExpressionKeys = new Set<string>()
  ): ObjectLiteralExpression {
    const normalizedExpression =
      this.normalizeSchemaExpression(schemaExpression);
    const expressionKey = this.getExpressionKey(normalizedExpression);
    if (visitedExpressionKeys.has(expressionKey)) {
      throw new Error(`Circular schema traversal while traversing ${context}`);
    }

    visitedExpressionKeys.add(expressionKey);

    const schemaCall = this.readSchemaMethodCall(
      normalizedExpression,
      context
    );

    if (ARRAY_METHOD_NAMES.has(schemaCall.methodName)) {
      return this.resolveObjectShapeFromSchemaExpression(
        this.readArrayItemExpression(schemaCall.callExpression, context),
        context,
        visitedExpressionKeys
      );
    }

    if (OBJECT_METHOD_NAMES.has(schemaCall.methodName)) {
      return this.readObjectShapeArgument(schemaCall.callExpression, context);
    }

    throw this.createUnsupportedSchemaTraversalError(
      schemaCall.methodName,
      normalizedExpression,
      context
    );
  }

  private readSchemaMethodCall(
    expression: Expression,
    context: string
  ): SchemaMethodCall {
    if (!Node.isCallExpression(expression)) {
      throw new Error(
        `Unsupported AST shape while traversing ${context}: expected call expression, got ${expression.getKindName()} (${expression.getText()})`
      );
    }

    const calleeExpression = expression.getExpression();
    if (!Node.isPropertyAccessExpression(calleeExpression)) {
      throw new Error(
        `Unsupported AST shape while traversing ${context}: expected property access call, got ${calleeExpression.getText()}`
      );
    }

    return {
      callExpression: expression,
      methodName: calleeExpression.getName(),
    };
  }

  private readArrayItemExpression(
    callExpression: CallExpression,
    context: string
  ): Expression {
    const itemExpression = callExpression.getArguments()[0];
    if (!itemExpression || !Node.isExpression(itemExpression)) {
      throw new Error(
        `Invalid array schema while traversing ${context}: missing item expression`
      );
    }

    return itemExpression;
  }

  private readObjectShapeArgument(
    callExpression: CallExpression,
    context: string
  ): ObjectLiteralExpression {
    const shapeArgument = callExpression.getArguments()[0];
    if (!shapeArgument || !Node.isObjectLiteralExpression(shapeArgument)) {
      throw new Error(
        `Unsupported object schema shape for ${context}: expected object literal argument in ${callExpression.getText()}`
      );
    }

    return shapeArgument;
  }

  private createUnsupportedSchemaTraversalError(
    methodName: string,
    expression: Expression,
    context: string
  ): Error {
    if (UNSUPPORTED_TYPED_TRAVERSAL_METHOD_NAMES.has(methodName)) {
      return new Error(
        `Unsupported AST shape for typed change at ${context}: ${methodName} internals require PatchChange`
      );
    }

    if (methodName === "extend") {
      return new Error(
        `Unsupported AST shape for typed change at ${context}: extend(...) requires PatchChange`
      );
    }

    return new Error(
      `Unsupported AST shape for typed change at ${context}: ${expression.getText()}`
    );
  }

  private getExpressionKey(expression: Expression): string {
    return `${expression.getSourceFile().getFilePath()}:${expression.getStart()}`;
  }

  private normalizeSchemaExpression(expression: Expression): Expression {
    let currentExpression = expression;
    let shouldNormalize = true;
    const visitedVariableDeclarations = new Set<string>();

    while (shouldNormalize) {
      shouldNormalize = false;

      if (Node.isParenthesizedExpression(currentExpression)) {
        currentExpression = currentExpression.getExpression();
        shouldNormalize = true;
        continue;
      }

      if (Node.isAsExpression(currentExpression)) {
        currentExpression = currentExpression.getExpression();
        shouldNormalize = true;
        continue;
      }

      if (Node.isSatisfiesExpression(currentExpression)) {
        currentExpression = currentExpression.getExpression();
        shouldNormalize = true;
        continue;
      }

      if (Node.isNonNullExpression(currentExpression)) {
        currentExpression = currentExpression.getExpression();
        shouldNormalize = true;
        continue;
      }

      if (Node.isIdentifier(currentExpression)) {
        const definitions = currentExpression.getDefinitions();
        if (definitions.length === 0) {
          return currentExpression;
        }

        const declarationNode = definitions[0].getDeclarationNode();
        if (!declarationNode || !Node.isVariableDeclaration(declarationNode)) {
          return currentExpression;
        }

        const declarationKey = `${declarationNode
          .getSourceFile()
          .getFilePath()}:${declarationNode.getStart()}`;

        if (visitedVariableDeclarations.has(declarationKey)) {
          return currentExpression;
        }

        visitedVariableDeclarations.add(declarationKey);

        const initializer = declarationNode.getInitializer();
        if (!initializer || !Node.isExpression(initializer)) {
          return currentExpression;
        }

        currentExpression = initializer;
        shouldNormalize = true;
        continue;
      }

      if (Node.isCallExpression(currentExpression)) {
        const calleeExpression = currentExpression.getExpression();
        if (Node.isPropertyAccessExpression(calleeExpression)) {
          const methodName = calleeExpression.getName();
          if (WRAPPER_METHOD_NAMES.has(methodName)) {
            currentExpression = calleeExpression.getExpression();
            shouldNormalize = true;
            continue;
          }
        }
      }
    }

    return currentExpression;
  }

  private getObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): PropertyAssignment | undefined {
    return objectLiteral
      .getProperties()
      .find((propertyNode) => {
        if (!Node.isPropertyAssignment(propertyNode)) {
          return false;
        }

        return this.getPropertyName(propertyNode) === propertyName;
      })
      ?.asKind(SyntaxKind.PropertyAssignment);
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

    return propertyNameNode.getText();
  }

  private findMainExportedSchemaDeclaration(
    sourceFile: SourceFile
  ): VariableDeclaration {
    const exportedSchemaDeclarations = sourceFile
      .getVariableDeclarations()
      .filter((declaration) => {
        const variableStatement = declaration.getVariableStatement();
        if (!variableStatement || !variableStatement.isExported()) {
          return false;
        }

        return declaration.getName().endsWith("Schema");
      });

    if (exportedSchemaDeclarations.length === 0) {
      throw new Error(
        `Missing exported *Schema declaration in ${sourceFile.getFilePath()}`
      );
    }

    if (exportedSchemaDeclarations.length === 1) {
      return exportedSchemaDeclarations[0];
    }

    const preferredDeclaration = exportedSchemaDeclarations.find(
      (declaration) => /^v\d{8}/.test(declaration.getName())
    );

    if (preferredDeclaration) {
      return preferredDeclaration;
    }

    throw new Error(
      `Ambiguous exported schema declarations in ${sourceFile.getFilePath()}: ${exportedSchemaDeclarations
        .map((declaration) => declaration.getName())
        .join(", ")}`
    );
  }
}

function orderChangesForBaseSchemaPaths(
  changes: AnyParsedChangeDefinition[]
): AnyParsedChangeDefinition[] {
  return changes
    .map((change, index) => ({ change, index }))
    .sort((left, right) => {
      const depthDifference =
        getChangePathDepth(right.change) - getChangePathDepth(left.change);

      return depthDifference || left.index - right.index;
    })
    .map(({ change }) => change);
}

function getChangePathDepth(change: AnyParsedChangeDefinition): number {
  switch (change.type) {
    case "add":
    case "rename":
      return splitPayloadPath(change.payload.payloadPath).length + 1;
    case "remove":
    case "replaceSchema":
    case "patch":
      return splitPayloadPath(change.payload.payloadPath).length;
    default:
      return 0;
  }
}

export function compactVersion(version: string): string {
  return version.replaceAll("-", "");
}

function splitPayloadPath(payloadPath: string): string[] {
  return payloadPath.split(".").filter((segment) => segment.length > 0);
}
