import {
  CallExpression,
  Expression,
  Node,
  ObjectLiteralExpression,
  VariableDeclaration,
} from "ts-morph";

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

interface SchemaMethodCall {
  callExpression: CallExpression;
  methodName: string;
}

export class SchemaExpressionResolver {
  public resolveObjectShape(
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

    const schemaCall = this.readSchemaMethodCall(normalizedExpression, context);

    if (ARRAY_METHOD_NAMES.has(schemaCall.methodName)) {
      return this.resolveObjectShape(
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
    return `${expression
      .getSourceFile()
      .getFilePath()}:${expression.getStart()}`;
  }

  private normalizeSchemaExpression(expression: Expression): Expression {
    let currentExpression = expression;
    const visitedVariableDeclarations = new Set<string>();
    let nextExpression = this.getNextNormalizedExpression(
      currentExpression,
      visitedVariableDeclarations
    );

    while (nextExpression) {
      currentExpression = nextExpression;
      nextExpression = this.getNextNormalizedExpression(
        currentExpression,
        visitedVariableDeclarations
      );
    }

    return currentExpression;
  }

  private getNextNormalizedExpression(
    expression: Expression,
    visitedVariableDeclarations: Set<string>
  ): Expression | undefined {
    return (
      this.unwrapSyntaxWrapperExpression(expression) ??
      this.readIdentifierInitializer(expression, visitedVariableDeclarations) ??
      this.readWrapperMethodReceiver(expression)
    );
  }

  private unwrapSyntaxWrapperExpression(
    expression: Expression
  ): Expression | undefined {
    if (Node.isParenthesizedExpression(expression)) {
      return expression.getExpression();
    }

    if (Node.isAsExpression(expression)) {
      return expression.getExpression();
    }

    if (Node.isSatisfiesExpression(expression)) {
      return expression.getExpression();
    }

    if (Node.isNonNullExpression(expression)) {
      return expression.getExpression();
    }

    return undefined;
  }

  private readIdentifierInitializer(
    expression: Expression,
    visitedVariableDeclarations: Set<string>
  ): Expression | undefined {
    const declaration = this.readIdentifierVariableDeclaration(expression);
    if (!declaration) {
      return undefined;
    }

    const declarationKey = this.getVariableDeclarationKey(declaration);
    if (visitedVariableDeclarations.has(declarationKey)) {
      return undefined;
    }

    visitedVariableDeclarations.add(declarationKey);

    const initializer = declaration.getInitializer();
    if (!initializer || !Node.isExpression(initializer)) {
      return undefined;
    }

    return initializer;
  }

  private readIdentifierVariableDeclaration(
    expression: Expression
  ): VariableDeclaration | undefined {
    if (!Node.isIdentifier(expression)) {
      return undefined;
    }

    const declarationNode = expression
      .getDefinitions()[0]
      ?.getDeclarationNode();
    if (!declarationNode || !Node.isVariableDeclaration(declarationNode)) {
      return undefined;
    }

    return declarationNode;
  }

  private readWrapperMethodReceiver(
    expression: Expression
  ): Expression | undefined {
    if (!Node.isCallExpression(expression)) {
      return undefined;
    }

    const calleeExpression = expression.getExpression();
    if (!Node.isPropertyAccessExpression(calleeExpression)) {
      return undefined;
    }

    if (!WRAPPER_METHOD_NAMES.has(calleeExpression.getName())) {
      return undefined;
    }

    return calleeExpression.getExpression();
  }

  private getVariableDeclarationKey(declaration: VariableDeclaration): string {
    return `${declaration
      .getSourceFile()
      .getFilePath()}:${declaration.getStart()}`;
  }
}
