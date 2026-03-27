import { readdir, readFile, writeFile } from 'fs/promises';
import { z } from 'zod';
import {
  IndentationText,
  Node,
  NewLineKind,
  Project,
  QuoteKind,
  type Expression,
  type ObjectLiteralExpression,
  type PropertyAssignment,
  ts,
  SourceFile,
  CallExpression,
} from 'ts-morph';
import { parseObjectPath } from '../../versioning/object-path.utils';
import { readZodSchemaExpression } from '../../versioning/zod-schema-expression.utils';
import type {
  ApiVersion,
  CompiledSchemaPatch,
  CompiledVersion,
} from '../../versioning/versioning.types';
import { basename, join } from 'path';

export type SchemaKind = 'request' | 'response';
export interface GenerateVersionedSchemasResult {
  createdVersions: readonly ApiVersion[];
  schemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny>;
}

export class VersionedSchemaGenerator {
  async generateVersionedSchemas(
    input: GenerateVersionedSchemasInput,
  ): Promise<GenerateVersionedSchemasResult> {
    if (input.supportedVersions.length === 0) {
      return {
        createdVersions: [],
        schemasByVersion: new Map<ApiVersion, z.ZodTypeAny>(),
      };
    }

    const existingVersions =
      input.existingVersions ?? (await this.readExistingVersions(input));
    const createdVersions: ApiVersion[] = [];
    const schemasByVersion = new Map<ApiVersion, z.ZodTypeAny>();
    const project = this.createProject();

    const firstVersion = input.supportedVersions[0];
    const firstVersionFilePath = this.schemaFilePath(
      input.contractsDirectory,
      firstVersion,
      input.kind,
    );

    if (!existingVersions.has(firstVersion)) {
      throw new Error(
        `Missing first-version schema seed file: ${basename(firstVersionFilePath)}.`,
      );
    }

    for (let index = 1; index < input.supportedVersions.length; index += 1) {
      const previousVersion = input.supportedVersions[index - 1];
      const nextVersion = input.supportedVersions[index];
      const compiledVersion = input.compiledVersions[index];

      if (!compiledVersion || compiledVersion.version !== nextVersion) {
        throw new Error(
          `Missing compiled version payload for ${nextVersion} while generating ${input.kind} schema artifacts.`,
        );
      }

      const previousFilePath = this.schemaFilePath(
        input.contractsDirectory,
        previousVersion,
        input.kind,
      );
      const nextFilePath = this.schemaFilePath(
        input.contractsDirectory,
        nextVersion,
        input.kind,
      );

      if (existingVersions.has(nextVersion)) {
        continue;
      }

      const sourceText = await readFile(previousFilePath, 'utf8');
      const sourceFile = project.createSourceFile(
        `/${basename(nextFilePath)}.working.ts`,
        sourceText,
        { overwrite: true },
      );

      const previousConstName = input.toSchemaConstName(
        previousVersion,
        input.kind,
      );
      const nextConstName = input.toSchemaConstName(nextVersion, input.kind);

      this.renameSchemaModuleIdentifiers(
        sourceFile,
        previousConstName,
        nextConstName,
      );

      const changes =
        input.kind === 'request'
          ? compiledVersion.requestChanges
          : compiledVersion.responseChanges;

      for (const change of changes) {
        this.applySchemaPatch(sourceFile, nextConstName, change.schemaPatch);
      }

      sourceFile.formatText();
      const output = ensureTrailingNewline(sourceFile.getFullText());
      await writeFile(nextFilePath, output, 'utf8');
      const generatedSchema = this.readSchemaFromSourceFile(
        sourceFile,
        nextConstName,
        nextVersion,
      );
      createdVersions.push(nextVersion);
      schemasByVersion.set(nextVersion, generatedSchema);
      existingVersions.add(nextVersion);
      project.removeSourceFile(sourceFile);
    }

    return {
      createdVersions,
      schemasByVersion,
    };
  }

  private createProject(): Project {
    return new Project({
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
        newLineKind: NewLineKind.LineFeed,
        quoteKind: QuoteKind.Single,
        useTrailingCommas: true,
      },
      useInMemoryFileSystem: true,
    });
  }

  private schemaFilePath(
    contractsDirectory: string,
    version: ApiVersion,
    kind: SchemaKind,
  ): string {
    return join(contractsDirectory, `${version}.${kind}.schema.ts`);
  }

  private async readExistingVersions(
    input: GenerateVersionedSchemasInput,
  ): Promise<Set<ApiVersion>> {
    const entries = await readdir(input.contractsDirectory, {
      withFileTypes: true,
    });
    const versions = new Set<ApiVersion>();

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue;
      }

      const match = entry.name.match(
        /^(\d{4}-\d{2}-\d{2})\.(request|response)\.schema\.ts$/,
      );
      if (!match) {
        continue;
      }

      const [, version, kind] = match;
      if (kind === input.kind) {
        versions.add(version as ApiVersion);
      }
    }

    return versions;
  }

  private renameSchemaModuleIdentifiers(
    sourceFile: SourceFile,
    previousConstName: string,
    nextConstName: string,
  ): void {
    const constDeclaration =
      sourceFile.getVariableDeclaration(previousConstName);

    if (!constDeclaration) {
      throw new Error(
        `Could not find schema const "${previousConstName}" in seed schema file.`,
      );
    }

    constDeclaration.rename(nextConstName);

    const previousTypeName = `${previousConstName}Type`;
    const nextTypeName = `${nextConstName}Type`;
    const typeAlias = sourceFile.getTypeAlias(previousTypeName);

    if (!typeAlias) {
      throw new Error(
        `Could not find schema type alias "${previousTypeName}" in seed schema file.`,
      );
    }

    typeAlias.rename(nextTypeName);

    const exportAssignments = sourceFile
      .getExportAssignments()
      .filter((assignment) => !assignment.isExportEquals());

    const defaultExport = exportAssignments[0];
    if (!defaultExport) {
      throw new Error('Could not find default export in seed schema file.');
    }

    defaultExport.setExpression(nextConstName);
  }

  private applySchemaPatch(
    sourceFile: SourceFile,
    schemaConstName: string,
    patch: CompiledSchemaPatch,
  ): void {
    const declaration = sourceFile.getVariableDeclaration(schemaConstName);
    if (!declaration) {
      throw new Error(
        `Schema const "${schemaConstName}" not found while applying payloadPath "${patch.payloadPath}".`,
      );
    }

    const initializer = declaration.getInitializer();
    if (!initializer || !Node.isExpression(initializer)) {
      throw new Error(
        `Schema const "${schemaConstName}" must define a valid initializer expression.`,
      );
    }

    const targetObjectLiteral = this.resolveObjectLiteralAtPath(
      initializer,
      parseObjectPath(patch.payloadPath, { allowWildcard: true }),
      patch.payloadPath,
      schemaConstName,
    );

    for (const field of patch.remove ?? []) {
      const existingProperty = findPropertyAssignment(
        targetObjectLiteral,
        field,
      );
      existingProperty?.remove();
    }

    if (!patch.set) {
      return;
    }

    for (const [field, spec] of Object.entries(patch.set)) {
      const initializerText = resolveSchemaInitializerExpression(spec.zod);
      validateSchemaInitializerExpression(initializerText);
      const existingProperty = findPropertyAssignment(
        targetObjectLiteral,
        field,
      );

      if (existingProperty) {
        existingProperty.setInitializer(initializerText);
        continue;
      }

      targetObjectLiteral.addPropertyAssignment({
        name: formatPropertyName(field),
        initializer: initializerText,
      });
    }
  }

  private resolveObjectLiteralAtPath(
    schemaExpression: Expression,
    tokens: readonly string[],
    payloadPath: string,
    schemaConstName: string,
  ): ObjectLiteralExpression {
    if (tokens.length === 0) {
      return this.extractObjectShapeLiteral(
        schemaExpression,
        payloadPath,
        schemaConstName,
      );
    }

    const [head, ...rest] = tokens;

    if (head === '*') {
      const elementExpression = this.extractArrayElementExpression(
        schemaExpression,
        payloadPath,
        schemaConstName,
      );
      return this.resolveObjectLiteralAtPath(
        elementExpression,
        rest,
        payloadPath,
        schemaConstName,
      );
    }

    const objectShape = this.extractObjectShapeLiteral(
      schemaExpression,
      payloadPath,
      schemaConstName,
    );
    const property = findPropertyAssignment(objectShape, head);

    if (!property) {
      throw new Error(
        `Invalid payloadPath "${payloadPath}". Missing segment "${head}" in schema "${schemaConstName}".`,
      );
    }

    const initializer = property.getInitializer();
    if (!initializer || !Node.isExpression(initializer)) {
      throw new Error(
        `Invalid payloadPath "${payloadPath}". Segment "${head}" has no initializer expression.`,
      );
    }

    return this.resolveObjectLiteralAtPath(
      initializer,
      rest,
      payloadPath,
      schemaConstName,
    );
  }

  private extractObjectShapeLiteral(
    expression: Expression,
    payloadPath: string,
    schemaConstName: string,
  ): ObjectLiteralExpression {
    const unwrapped = this.unwrapParenthesizedExpression(expression);

    if (Node.isCallExpression(unwrapped)) {
      const callee = unwrapped.getExpression();

      if (this.isZodFactoryCall(unwrapped, 'object')) {
        const firstArgument = unwrapped.getArguments()[0];
        if (!firstArgument || !Node.isObjectLiteralExpression(firstArgument)) {
          breakInvalidObject(payloadPath, schemaConstName);
        }

        return firstArgument;
      }

      if (Node.isPropertyAccessExpression(callee)) {
        return this.extractObjectShapeLiteral(
          callee.getExpression(),
          payloadPath,
          schemaConstName,
        );
      }
    }

    breakInvalidObject(payloadPath, schemaConstName);
  }

  private extractArrayElementExpression(
    expression: Expression,
    payloadPath: string,
    schemaConstName: string,
  ): Expression {
    const unwrapped = this.unwrapParenthesizedExpression(expression);

    if (Node.isCallExpression(unwrapped)) {
      const callee = unwrapped.getExpression();

      if (this.isZodFactoryCall(unwrapped, 'array')) {
        const firstArgument = unwrapped.getArguments()[0];
        if (firstArgument && Node.isExpression(firstArgument)) {
          return firstArgument;
        }

        breakInvalidArray(payloadPath, schemaConstName);
      }

      if (Node.isPropertyAccessExpression(callee)) {
        return this.extractArrayElementExpression(
          callee.getExpression(),
          payloadPath,
          schemaConstName,
        );
      }
    }

    breakInvalidArray(payloadPath, schemaConstName);
  }

  private unwrapParenthesizedExpression(expression: Expression): Expression {
    let cursor: Expression = expression;

    while (Node.isParenthesizedExpression(cursor)) {
      const inner = cursor.getExpression();
      if (!Node.isExpression(inner)) {
        break;
      }

      cursor = inner;
    }

    return cursor;
  }

  private isZodFactoryCall(
    callExpression: CallExpression,
    factoryName: 'object' | 'array',
  ): boolean {
    const callee = callExpression.getExpression();
    if (!Node.isPropertyAccessExpression(callee)) {
      return false;
    }

    if (callee.getName() !== factoryName) {
      return false;
    }

    const target = callee.getExpression();
    return Node.isIdentifier(target) && target.getText() === 'z';
  }

  private readSchemaFromSourceFile(
    sourceFile: SourceFile,
    schemaConstName: string,
    version: ApiVersion,
  ): z.ZodTypeAny {
    const declaration = sourceFile.getVariableDeclaration(schemaConstName);
    if (!declaration) {
      throw new Error(
        `Could not resolve generated schema const "${schemaConstName}" for version ${version}.`,
      );
    }

    const initializer = declaration.getInitializer();
    if (!initializer || !Node.isExpression(initializer)) {
      throw new Error(
        `Generated schema const "${schemaConstName}" for version ${version} has no initializer expression.`,
      );
    }

    const initializerText = initializer.getText();
    return evaluateSchemaExpression(initializerText, schemaConstName, version);
  }
}

interface GenerateVersionedSchemasInput {
  contractsDirectory: string;
  supportedVersions: readonly ApiVersion[];
  compiledVersions: readonly CompiledVersion[];
  kind: SchemaKind;
  toSchemaConstName(version: ApiVersion, kind: SchemaKind): string;
  existingVersions?: Set<ApiVersion>;
}

function isIdentifier(value: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value);
}

function formatPropertyName(value: string): string {
  return isIdentifier(value) ? value : JSON.stringify(value);
}

function getPropertyNameText(property: PropertyAssignment): string | undefined {
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

function findPropertyAssignment(
  objectLiteral: ObjectLiteralExpression,
  name: string,
): PropertyAssignment | undefined {
  return objectLiteral
    .getProperties()
    .find(
      (property): property is PropertyAssignment =>
        Node.isPropertyAssignment(property) &&
        getPropertyNameText(property) === name,
    );
}

function validateSchemaInitializerExpression(expression: string): void {
  const trimmed = expression.trim();
  if (trimmed.length === 0) {
    throw new Error(
      'schema patch set entries must resolve to a non-empty zod schema expression.',
    );
  }

  const probe = ts.transpileModule(`const value = ${trimmed};`, {
    reportDiagnostics: true,
  });
  const firstError = (probe.diagnostics ?? []).find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (firstError) {
    const message = ts.flattenDiagnosticMessageText(
      firstError.messageText,
      '\n',
    );
    throw new Error(`Invalid zod schema expression "${trimmed}": ${message}`);
  }
}

function resolveSchemaInitializerExpression(schema: z.ZodTypeAny): string {
  const metadata = readZodSchemaExpression(schema);
  if (!metadata) {
    throw new Error(
      'Could not resolve zod schema expression for schema patch set entry. Ensure schema patch entries come from class-based schema properties or explicitly annotated zod schemas.',
    );
  }

  const trimmed = metadata.trim();
  if (trimmed.length === 0) {
    throw new Error(
      'Could not resolve zod schema expression for schema patch set entry. Ensure schema patch entries come from class-based schema properties or explicitly annotated zod schemas.',
    );
  }

  try {
    return extractSchemaExpressionFromMethod(trimmed);
  } catch {
    // Metadata may already be a direct expression (e.g. tests/manual specs).
    return trimmed;
  }
}

function extractSchemaExpressionFromMethod(methodSource: string): string {
  const project = new Project({
    useInMemoryFileSystem: true,
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      newLineKind: NewLineKind.LineFeed,
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  });

  const sourceFile = project.createSourceFile(
    '/SchemaExpressionProbe.ts',
    `class SchemaExpressionProbe { ${methodSource} }`,
    { overwrite: true },
  );

  const classDeclaration = sourceFile.getClassOrThrow('SchemaExpressionProbe');
  const methodDeclaration = classDeclaration.getMethods()[0];
  if (!methodDeclaration) {
    throw new Error('Method declaration not found.');
  }

  const returnStatement = methodDeclaration
    .getStatements()
    .find((statement) => statement.getKindName() === 'ReturnStatement');
  if (!returnStatement || !ts.isReturnStatement(returnStatement.compilerNode)) {
    throw new Error('Missing return statement.');
  }

  const expressionNode = returnStatement.compilerNode.expression;
  if (!expressionNode) {
    throw new Error('Method must return an expression.');
  }

  const expression = expressionNode.getText(sourceFile.compilerNode).trim();
  if (expression.length === 0) {
    throw new Error('Returned expression is empty.');
  }

  return expression;
}

function breakInvalidObject(
  payloadPath: string,
  schemaConstName: string,
): never {
  throw new Error(
    `Invalid payloadPath "${payloadPath}". Target must resolve to a z.object(...) shape in schema "${schemaConstName}".`,
  );
}

function breakInvalidArray(
  payloadPath: string,
  schemaConstName: string,
): never {
  throw new Error(
    `Invalid payloadPath "${payloadPath}". Wildcard '*' must resolve to a z.array(...) in schema "${schemaConstName}".`,
  );
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function evaluateSchemaExpression(
  initializerText: string,
  schemaConstName: string,
  version: ApiVersion,
): z.ZodTypeAny {
  let evaluated: unknown;

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    evaluated = new Function('z', `return (${initializerText});`)(z) as unknown;
  } catch (error) {
    throw new Error(
      `Failed to evaluate generated schema "${schemaConstName}" for version ${version}: ${(error as Error).message}`,
    );
  }

  if (
    !evaluated ||
    typeof evaluated !== 'object' ||
    !('safeParse' in evaluated) ||
    typeof (evaluated as { safeParse?: unknown }).safeParse !== 'function'
  ) {
    throw new Error(
      `Generated schema "${schemaConstName}" for version ${version} did not evaluate to a Zod schema.`,
    );
  }

  return evaluated as z.ZodTypeAny;
}
