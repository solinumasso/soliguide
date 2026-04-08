import {
  Node,
  type Expression,
  type ObjectLiteralExpression,
  type PropertyAssignment,
  type SourceFile,
  type VariableDeclaration,
} from 'ts-morph';
import { ExtractedChange } from './types';

export class VersionedSchemaChangeApplier {
  apply(
    sourceFile: SourceFile,
    rootSchemaConstName: string,
    change: ExtractedChange,
  ): void {
    const payloadTarget = this.resolvePayloadTarget(
      sourceFile,
      rootSchemaConstName,
      change,
    );

    if (change.replace) {
      payloadTarget.expression.replaceWithText(change.replace);
    }

    if (change.remove.length === 0 && change.set.size === 0) {
      return;
    }

    const targetObject = this.resolveObjectLiteralForExpression(
      sourceFile,
      payloadTarget.expression,
      change,
    );

    for (const field of change.remove) {
      const property = targetObject
        .getProperties()
        .find(
          (candidate): candidate is PropertyAssignment =>
            Node.isPropertyAssignment(candidate) &&
            this.readPropertyName(candidate) === field,
        );

      if (property) {
        property.remove();
      }
    }

    for (const [field, schemaText] of change.set.entries()) {
      const existingProperty = targetObject
        .getProperties()
        .find(
          (candidate): candidate is PropertyAssignment =>
            Node.isPropertyAssignment(candidate) &&
            this.readPropertyName(candidate) === field,
        );

      if (existingProperty) {
        existingProperty.setInitializer(schemaText);
        continue;
      }

      targetObject.addPropertyAssignment({
        name: field,
        initializer: schemaText,
      });
    }
  }

  private resolvePayloadTarget(
    sourceFile: SourceFile,
    rootSchemaConstName: string,
    change: ExtractedChange,
  ): ResolvedPayloadTarget {
    const rootSchemaDeclaration = this.findRootSchemaDeclaration(
      sourceFile,
      rootSchemaConstName,
    );
    const rootInitializer = rootSchemaDeclaration.getInitializer();

    if (!rootInitializer) {
      throw new Error(
        `Root schema "${rootSchemaDeclaration.getName()}" has no initializer.`,
      );
    }

    let currentExpression: Expression = rootInitializer;
    const segments = this.readPayloadSegments(change.payloadPath);

    for (const segment of segments) {
      if (segment === '*') {
        currentExpression = this.resolveArrayElementExpression(
          sourceFile,
          currentExpression,
          change,
        );
        continue;
      }

      const objectLiteral = this.resolveObjectLiteralForExpression(
        sourceFile,
        currentExpression,
        change,
      );

      const property = objectLiteral
        .getProperties()
        .find(
          (candidate): candidate is PropertyAssignment =>
            Node.isPropertyAssignment(candidate) &&
            this.readPropertyName(candidate) === segment,
        );

      if (!property) {
        throw new Error(
          `[${change.changeClassName}] Cannot resolve payloadPath "${change.payloadPath}": segment "${segment}" does not exist.`,
        );
      }

      currentExpression = property.getInitializerOrThrow();
    }

    return {
      expression: currentExpression,
    };
  }

  private readPayloadSegments(payloadPath: string): string[] {
    if (payloadPath === '/' || payloadPath === '') {
      return [];
    }

    if (!payloadPath.startsWith('/')) {
      throw new Error(`Unsupported payloadPath format: "${payloadPath}".`);
    }

    return payloadPath.split('/').filter((segment) => segment.length > 0);
  }

  private resolveArrayElementExpression(
    sourceFile: SourceFile,
    expression: Expression,
    change: ExtractedChange,
  ): Expression {
    const resolvedExpression = this.resolveExpressionValue(
      sourceFile,
      expression,
    );
    const element = this.findArrayElementExpression(resolvedExpression);

    if (!element) {
      throw new Error(
        `[${change.changeClassName}] Cannot resolve payloadPath "${change.payloadPath}": "*" expects a z.array(...) segment.`,
      );
    }

    return element;
  }

  private findArrayElementExpression(
    expression: Expression,
  ): Expression | undefined {
    const unwrapped = this.unwrapExpression(expression);

    if (!Node.isCallExpression(unwrapped)) {
      return undefined;
    }

    const callExpression = unwrapped.getExpression();

    if (
      Node.isPropertyAccessExpression(callExpression) &&
      callExpression.getName() === 'array'
    ) {
      const firstArgument = unwrapped.getArguments()[0];
      return firstArgument && Node.isExpression(firstArgument)
        ? firstArgument
        : undefined;
    }

    if (Node.isPropertyAccessExpression(callExpression)) {
      const chainedCall = callExpression.getExpression();
      if (Node.isCallExpression(chainedCall)) {
        return this.findArrayElementExpression(chainedCall);
      }
    }

    return undefined;
  }

  private resolveObjectLiteralForExpression(
    sourceFile: SourceFile,
    expression: Expression,
    change: ExtractedChange,
  ): ObjectLiteralExpression {
    const resolvedExpression = this.resolveExpressionValue(
      sourceFile,
      expression,
    );
    const objectLiteral = this.findZodObjectLiteral(resolvedExpression);

    if (!objectLiteral) {
      throw new Error(
        `[${change.changeClassName}] Cannot resolve payloadPath "${change.payloadPath}": target is not a z.object(...) schema.`,
      );
    }

    return objectLiteral;
  }

  private resolveExpressionValue(
    sourceFile: SourceFile,
    expression: Expression,
  ): Expression {
    let currentExpression = this.unwrapExpression(expression);
    const visitedIdentifiers = new Set<string>();

    while (Node.isIdentifier(currentExpression)) {
      const identifierName = currentExpression.getText();

      if (visitedIdentifiers.has(identifierName)) {
        break;
      }

      visitedIdentifiers.add(identifierName);
      const declaration = sourceFile.getVariableDeclaration(identifierName);
      const initializer = declaration?.getInitializer();

      if (!initializer) {
        break;
      }

      currentExpression = this.unwrapExpression(initializer);
    }

    return currentExpression;
  }

  private findZodObjectLiteral(
    expression: Expression,
  ): ObjectLiteralExpression | undefined {
    const unwrapped = this.unwrapExpression(expression);

    if (!Node.isCallExpression(unwrapped)) {
      return undefined;
    }

    const callExpression = unwrapped.getExpression();

    if (
      Node.isPropertyAccessExpression(callExpression) &&
      callExpression.getName() === 'object'
    ) {
      const firstArgument = unwrapped.getArguments()[0];
      if (firstArgument && Node.isObjectLiteralExpression(firstArgument)) {
        return firstArgument;
      }
    }

    if (Node.isPropertyAccessExpression(callExpression)) {
      const chainedCall = callExpression.getExpression();
      if (Node.isCallExpression(chainedCall)) {
        return this.findZodObjectLiteral(chainedCall);
      }
    }

    return undefined;
  }

  private findRootSchemaDeclaration(
    sourceFile: SourceFile,
    rootSchemaConstName: string,
  ): VariableDeclaration {
    const declaration = sourceFile.getVariableDeclaration(rootSchemaConstName);

    if (!declaration) {
      throw new Error(
        `Could not find root schema declaration "${rootSchemaConstName}".`,
      );
    }

    return declaration;
  }

  private unwrapExpression(expression: Expression): Expression {
    let current = expression;

    while (true) {
      if (Node.isAsExpression(current)) {
        current = current.getExpression();
        continue;
      }

      if (Node.isParenthesizedExpression(current)) {
        current = current.getExpression();
        continue;
      }

      return current;
    }
  }

  private readPropertyName(property: PropertyAssignment): string {
    const nameNode = property.getNameNode();

    if (Node.isIdentifier(nameNode)) {
      return nameNode.getText();
    }

    if (Node.isStringLiteral(nameNode)) {
      return nameNode.getLiteralText();
    }

    if (Node.isNoSubstitutionTemplateLiteral(nameNode)) {
      return nameNode.getLiteralText();
    }

    return nameNode.getText();
  }
}

type ResolvedPayloadTarget = {
  expression: Expression;
};
