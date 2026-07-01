import {
  Expression,
  Node,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
  VariableDeclaration,
} from "ts-morph";

import { ChangeApplyContext } from "./change-handlers";
import { SchemaExpressionResolver } from "./schema-expression-resolver";
import { splitPayloadPath } from "./schema-path-utils";

export class SchemaDocument {
  private readonly expressionResolver = new SchemaExpressionResolver();

  private constructor(
    public readonly sourceFile: SourceFile,
    public readonly mainSchemaDeclaration: VariableDeclaration
  ) {}

  public static fromSourceFile(sourceFile: SourceFile): SchemaDocument {
    return new SchemaDocument(
      sourceFile,
      findMainExportedSchemaDeclaration(sourceFile)
    );
  }

  public createApplyContext(): ChangeApplyContext {
    return {
      addObjectProperty: (objectLiteral, propertyName, initializer) =>
        this.addObjectProperty(objectLiteral, propertyName, initializer),
      assertPropertyMissing: (objectLiteral, propertyName, errorMessage) =>
        this.assertPropertyMissing(objectLiteral, propertyName, errorMessage),
      readPropertyInitializer: (property, errorMessage) =>
        this.readPropertyInitializer(property, errorMessage),
      requireObjectProperty: (objectLiteral, propertyName, errorMessage) =>
        this.requireObjectProperty(objectLiteral, propertyName, errorMessage),
      resolveChangeFieldProperty: (payloadPath, context) =>
        this.resolveChangeFieldProperty(payloadPath, context),
      resolveChangeObject: (payloadPath, context) =>
        this.resolveChangeObject(payloadPath, context),
      setOrAddObjectProperty: (objectLiteral, propertyName, initializer) =>
        this.setOrAddObjectProperty(objectLiteral, propertyName, initializer),
      sourceFile: this.sourceFile,
    };
  }

  public ensureMainSchemaFooter(mainSchemaVariableName?: string): void {
    const mainSchemaName =
      mainSchemaVariableName ?? this.mainSchemaDeclaration.getName();
    const typeAliasName = `V${mainSchemaName.slice(1)}`.replace(/Schema$/, "");

    const typeAlias = this.sourceFile.getTypeAlias(typeAliasName);
    if (!typeAlias) {
      this.sourceFile.addTypeAlias({
        isExported: true,
        name: typeAliasName,
        type: `z.infer<typeof ${mainSchemaName}>`,
      });
    }

    const defaultExportAssignment = this.sourceFile
      .getExportAssignments()
      .find((assignment) => !assignment.isExportEquals());

    if (!defaultExportAssignment) {
      this.sourceFile.addExportAssignment({
        expression: mainSchemaName,
      });
      return;
    }

    const defaultExpression = defaultExportAssignment.getExpression();
    if (!defaultExpression || defaultExpression.getText() !== mainSchemaName) {
      defaultExportAssignment.setExpression(mainSchemaName);
    }
  }

  private resolveChangeFieldProperty(
    payloadPath: string,
    context: string
  ): PropertyAssignment {
    return this.resolveFieldPropertyAtPath(
      splitPayloadPath(payloadPath),
      context
    );
  }

  private resolveChangeObject(
    payloadPath: string,
    context: string
  ): ObjectLiteralExpression {
    return this.resolveObjectAtPath(splitPayloadPath(payloadPath), context);
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
    pathSegments: string[],
    context: string
  ): PropertyAssignment {
    if (pathSegments.length === 0) {
      throw new Error(`Invalid empty payloadPath for ${context}`);
    }

    const fieldName = pathSegments[pathSegments.length - 1];
    const parentPathSegments = pathSegments.slice(0, -1);
    const parentObject = this.resolveObjectAtPath(parentPathSegments, context);

    return this.requireObjectProperty(
      parentObject,
      fieldName,
      `Invalid payloadPath ${pathSegments.join(
        "."
      )} for ${context}: field ${fieldName} not found`
    );
  }

  private resolveObjectAtPath(
    pathSegments: string[],
    context: string
  ): ObjectLiteralExpression {
    let currentExpression = this.mainSchemaDeclaration.getInitializer();
    if (!currentExpression) {
      throw new Error(
        `Missing initializer for main schema ${this.mainSchemaDeclaration.getName()} in ${this.sourceFile.getFilePath()}`
      );
    }

    for (const segment of pathSegments) {
      const currentObjectShape = this.expressionResolver.resolveObjectShape(
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

    return this.expressionResolver.resolveObjectShape(
      currentExpression,
      context
    );
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
}

function findMainExportedSchemaDeclaration(
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

  const preferredDeclaration = exportedSchemaDeclarations.find((declaration) =>
    /^v\d{8}/.test(declaration.getName())
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
