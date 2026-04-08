import {
  IndentationText,
  NewLineKind,
  Node,
  Project,
  QuoteKind,
  SyntaxKind,
  type PropertyAssignment,
  type ShorthandPropertyAssignment,
} from 'ts-morph';

type ConstructorLike = { toString(): string };

function normalizeNonEmptyString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeExtractedSchemaExpression(expression: string): string {
  return expression
    .replace(/\bzod_\d+\.z\b/g, 'z')
    .replace(/\bzod_\d+\.default\b/g, 'z')
    .replace(/\bzod_\d+\./g, 'z.')
    .replace(/\b__vite_ssr_import_\d+__\.z\b/g, 'z')
    .replace(/\b__vite_ssr_import_\d+__\.default\b/g, 'z')
    .replace(/\b__vite_ssr_import_\d+__\.([A-Za-z_$][A-Za-z0-9_$]*)\b/g, '$1')
    .replace(
      /\b[A-Za-z_$][A-Za-z0-9_$]*_\d+\.([A-Za-z_$][A-Za-z0-9_$]*)\b/g,
      '$1',
    );
}

function escapeRegExpPattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function readStringProperty(
  target: object,
  propertyName: string,
): string | undefined {
  const value: unknown = Reflect.get(target, propertyName);
  return typeof value === 'string' ? normalizeNonEmptyString(value) : undefined;
}

export function extractAssignedPropertyExpression(
  constructorValue: ConstructorLike,
  propertyName: string,
): string | undefined {
  const constructorSource = constructorValue.toString();
  const escapedProperty = escapeRegExpPattern(propertyName);
  const instanceAssignmentPattern = new RegExp(
    `this\\.${escapedProperty}\\s*=\\s*([\\s\\S]*?);`,
  );
  const instanceAssignmentMatch = constructorSource.match(
    instanceAssignmentPattern,
  );
  if (instanceAssignmentMatch?.[1]) {
    const expression = normalizeNonEmptyString(instanceAssignmentMatch[1]);
    return expression
      ? normalizeExtractedSchemaExpression(expression)
      : undefined;
  }

  const classFieldPattern = new RegExp(
    `${escapedProperty}\\s*=\\s*([\\s\\S]*?);`,
  );
  const classFieldMatch = constructorSource.match(classFieldPattern);
  if (!classFieldMatch?.[1]) {
    return undefined;
  }

  const expression = normalizeNonEmptyString(classFieldMatch[1]);
  return expression
    ? normalizeExtractedSchemaExpression(expression)
    : undefined;
}

export function extractMethodReturnExpression(
  methodSource: string,
): string | undefined {
  const returnExpression = parseMethodReturnExpression(methodSource);
  const normalized = normalizeNonEmptyString(returnExpression ?? '');
  return normalized
    ? normalizeExtractedSchemaExpression(normalized)
    : undefined;
}

export function extractMethodReturnedObjectPropertyExpressions(
  methodSource: string,
): Readonly<Record<string, string>> {
  const returnExpression = parseMethodReturnExpression(methodSource);
  if (!returnExpression) {
    return {};
  }

  const project = createSchemaExtractorProject();
  const sourceFile = project.createSourceFile(
    '/SchemaExpressionObjectProbe.ts',
    `const value = (${returnExpression});`,
    { overwrite: true },
  );
  const declaration = sourceFile.getVariableDeclaration('value');
  const initializer = declaration?.getInitializer();
  const objectLiteral = Node.isObjectLiteralExpression(initializer)
    ? initializer
    : Node.isParenthesizedExpression(initializer)
      ? initializer.getExpressionIfKind(SyntaxKind.ObjectLiteralExpression)
      : undefined;
  if (!objectLiteral) {
    return {};
  }

  const expressionsByField: Record<string, string> = {};
  for (const property of objectLiteral.getProperties()) {
    if (Node.isPropertyAssignment(property)) {
      const field = readObjectPropertyFieldName(property);
      const expression = property.getInitializer()?.getText();
      if (field && expression) {
        const normalized = normalizeNonEmptyString(expression);
        if (normalized) {
          expressionsByField[field] =
            normalizeExtractedSchemaExpression(normalized);
        }
      }
      continue;
    }

    if (Node.isShorthandPropertyAssignment(property)) {
      const field = readObjectPropertyFieldName(property);
      if (field) {
        expressionsByField[field] = normalizeExtractedSchemaExpression(field);
      }
    }
  }

  return expressionsByField;
}

function parseMethodReturnExpression(methodSource: string): string | undefined {
  const project = createSchemaExtractorProject();
  const sourceFile = project.createSourceFile(
    '/SchemaExpressionMethodProbe.ts',
    `class SchemaExpressionProbe { ${methodSource} }`,
    { overwrite: true },
  );
  const method = sourceFile.getClass('SchemaExpressionProbe')?.getMethods()[0];
  if (!method) {
    return undefined;
  }

  const returnStatement = method.getFirstDescendantByKind(
    SyntaxKind.ReturnStatement,
  );
  const expression = returnStatement?.getExpression()?.getText();
  const normalized = normalizeNonEmptyString(expression ?? '');
  return normalized
    ? normalizeExtractedSchemaExpression(normalized)
    : undefined;
}

function readObjectPropertyFieldName(
  property: PropertyAssignment | ShorthandPropertyAssignment,
): string | undefined {
  const nameNode = property.getNameNode();
  if (Node.isIdentifier(nameNode) || Node.isNumericLiteral(nameNode)) {
    return nameNode.getText();
  }

  if (
    Node.isStringLiteral(nameNode) ||
    Node.isNoSubstitutionTemplateLiteral(nameNode)
  ) {
    return nameNode.getLiteralText();
  }

  return undefined;
}

function createSchemaExtractorProject(): Project {
  return new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      newLineKind: NewLineKind.LineFeed,
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  });
}
