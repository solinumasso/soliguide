import {
  Node,
  SyntaxKind,
  type ArrayLiteralExpression,
  type ClassDeclaration,
  type Expression,
  type MethodDeclaration,
  type PropertyAssignment,
  type SourceFile,
} from 'ts-morph';
import { ExtractedChange } from './types';

export class VersionedSchemaChangeExtractor {
  extractChanges(input: {
    kind: 'request' | 'response';
    versionSource: SourceFile;
    changesSource: SourceFile;
  }): ExtractedChange[] {
    const orderedChangeClassNames = this.readOrderedChangeClassNames(
      input.versionSource,
      input.kind,
    );

    return orderedChangeClassNames.map((changeClassName) =>
      this.extractPatchFromChangeClass(input.changesSource, changeClassName),
    );
  }

  private readOrderedChangeClassNames(
    versionSource: SourceFile,
    kind: 'request' | 'response',
  ): string[] {
    const providerClass = versionSource
      .getClasses()
      .find((candidate) => candidate.getMethod('toVersion'));

    if (!providerClass) {
      throw new Error(
        'Could not find a version provider class with toVersion().',
      );
    }

    const toVersionMethod = providerClass.getMethodOrThrow('toVersion');
    const changeArray = this.readChangesArrayFromVersionMethod(
      toVersionMethod,
      kind,
    );

    return changeArray.getElements().map((element) => {
      const constructorCall = element.asKindOrThrow(SyntaxKind.NewExpression);
      return constructorCall.getExpression().getText();
    });
  }

  private readChangesArrayFromVersionMethod(
    toVersionMethod: MethodDeclaration,
    kind: 'request' | 'response',
  ): ArrayLiteralExpression {
    const returnObject = toVersionMethod
      .getDescendantsOfKind(SyntaxKind.ReturnStatement)
      .map((statement) => statement.getExpression())
      .find(Node.isObjectLiteralExpression);

    if (!returnObject) {
      throw new Error('Could not find a return object in toVersion().');
    }

    const propertyName =
      kind === 'request' ? 'requestChanges' : 'responseChanges';

    const changesProperty = returnObject
      .getProperties()
      .find(
        (property): property is PropertyAssignment =>
          Node.isPropertyAssignment(property) &&
          this.readPropertyName(property) === propertyName,
      );

    if (!changesProperty) {
      throw new Error(`Could not find ${propertyName} in toVersion() payload.`);
    }

    return changesProperty
      .getInitializerOrThrow()
      .asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  }

  private extractPatchFromChangeClass(
    changesSource: SourceFile,
    changeClassName: string,
  ): ExtractedChange {
    const classDeclaration = changesSource.getClass(changeClassName);

    if (!classDeclaration) {
      throw new Error(`Change class "${changeClassName}" not found.`);
    }

    const extendsExpressionText = classDeclaration
      .getExtends()
      ?.getExpression()
      .getText();

    if (!extendsExpressionText) {
      throw new Error(`Change class "${changeClassName}" has no base class.`);
    }

    if (extendsExpressionText.includes('RenameFieldChange')) {
      return this.extractRenamePatch(classDeclaration, changeClassName);
    }

    if (extendsExpressionText.includes('RemoveFieldChange')) {
      return this.extractRemovePatch(classDeclaration, changeClassName);
    }

    if (extendsExpressionText.includes('ReplaceFieldChange')) {
      return this.extractReplacePatch(classDeclaration, changeClassName);
    }

    if (extendsExpressionText.includes('CustomTransformChange')) {
      return this.extractCustomPatch(classDeclaration, changeClassName);
    }

    throw new Error(
      `Unsupported change base class "${extendsExpressionText}" for "${changeClassName}".`,
    );
  }

  private extractRenamePatch(
    classDeclaration: ClassDeclaration,
    changeClassName: string,
  ): ExtractedChange {
    const payloadPath = this.readStringClassProperty(
      classDeclaration,
      'payloadPath',
      changeClassName,
    );
    const from = this.readStringClassProperty(
      classDeclaration,
      'from',
      changeClassName,
    );
    const to = this.readStringClassProperty(
      classDeclaration,
      'to',
      changeClassName,
    );
    const schema = this.readExpressionClassProperty(
      classDeclaration,
      'schema',
      changeClassName,
    );

    return {
      changeClassName,
      payloadPath,
      remove: [from],
      set: new Map([[to, schema]]),
    };
  }

  private extractRemovePatch(
    classDeclaration: ClassDeclaration,
    changeClassName: string,
  ): ExtractedChange {
    const payloadPath = this.readStringClassProperty(
      classDeclaration,
      'payloadPath',
      changeClassName,
    );
    const field = this.readStringClassProperty(
      classDeclaration,
      'field',
      changeClassName,
    );

    return {
      changeClassName,
      payloadPath,
      remove: [field],
      set: new Map(),
    };
  }

  private extractReplacePatch(
    classDeclaration: ClassDeclaration,
    changeClassName: string,
  ): ExtractedChange {
    const payloadPath = this.readStringClassProperty(
      classDeclaration,
      'payloadPath',
      changeClassName,
    );
    const field = this.readStringClassProperty(
      classDeclaration,
      'field',
      changeClassName,
    );
    const schema = this.readExpressionClassProperty(
      classDeclaration,
      'schema',
      changeClassName,
    );

    return {
      changeClassName,
      payloadPath,
      remove: [field],
      set: new Map([[field, schema]]),
    };
  }

  private extractCustomPatch(
    classDeclaration: ClassDeclaration,
    changeClassName: string,
  ): ExtractedChange {
    const payloadPath = this.readStringClassProperty(
      classDeclaration,
      'payloadPath',
      changeClassName,
    );

    const setMethod = classDeclaration.getMethod('schemaPatchSet');
    const removeMethod = classDeclaration.getMethod('schemaPatchRemove');
    const replaceMethod = classDeclaration.getMethod('schemaPatchReplace');

    return {
      changeClassName,
      payloadPath,
      set: setMethod
        ? this.readSetMapFromMethod(setMethod, changeClassName)
        : new Map<string, string>(),
      remove: removeMethod
        ? this.readStringArrayFromMethod(removeMethod, changeClassName)
        : [],
      replace: replaceMethod
        ? this.readReturnExpressionFromMethod(
            replaceMethod,
            changeClassName,
          ).getText()
        : undefined,
    };
  }

  private readStringClassProperty(
    classDeclaration: ClassDeclaration,
    propertyName: string,
    changeClassName: string,
  ): string {
    const property = classDeclaration.getProperty(propertyName);

    if (!property) {
      throw new Error(
        `Change "${changeClassName}" is missing property "${propertyName}".`,
      );
    }

    const initializer = property.getInitializer();
    if (!initializer) {
      throw new Error(
        `Property "${propertyName}" in change "${changeClassName}" has no initializer.`,
      );
    }

    return this.readStringExpression(
      initializer,
      changeClassName,
      propertyName,
    );
  }

  private readExpressionClassProperty(
    classDeclaration: ClassDeclaration,
    propertyName: string,
    changeClassName: string,
  ): string {
    const property = classDeclaration.getProperty(propertyName);

    if (!property) {
      throw new Error(
        `Change "${changeClassName}" is missing property "${propertyName}".`,
      );
    }

    const initializer = property.getInitializer();
    if (!initializer) {
      throw new Error(
        `Property "${propertyName}" in change "${changeClassName}" has no initializer.`,
      );
    }

    return this.unwrapExpression(initializer).getText();
  }

  private readSetMapFromMethod(
    method: MethodDeclaration,
    changeClassName: string,
  ): Map<string, string> {
    const expression = this.readReturnExpressionFromMethod(
      method,
      changeClassName,
    );
    const objectLiteral = expression.asKindOrThrow(
      SyntaxKind.ObjectLiteralExpression,
    );
    const map = new Map<string, string>();

    for (const property of objectLiteral.getProperties()) {
      if (!Node.isPropertyAssignment(property)) {
        continue;
      }

      map.set(
        this.readPropertyName(property),
        property.getInitializerOrThrow().getText(),
      );
    }

    return map;
  }

  private readStringArrayFromMethod(
    method: MethodDeclaration,
    changeClassName: string,
  ): string[] {
    const expression = this.readReturnExpressionFromMethod(
      method,
      changeClassName,
    );
    const arrayLiteral = expression.asKindOrThrow(
      SyntaxKind.ArrayLiteralExpression,
    );

    return arrayLiteral
      .getElements()
      .map((element) =>
        this.readStringExpression(element, changeClassName, method.getName()),
      );
  }

  private readReturnExpressionFromMethod(
    method: MethodDeclaration,
    changeClassName: string,
  ): Expression {
    const returnStatement = method
      .getDescendantsOfKind(SyntaxKind.ReturnStatement)
      .find((statement) => !!statement.getExpression());

    if (!returnStatement || !returnStatement.getExpression()) {
      throw new Error(
        `Could not find a return expression in "${changeClassName}.${method.getName()}".`,
      );
    }

    return this.unwrapExpression(returnStatement.getExpressionOrThrow());
  }

  private readStringExpression(
    expression: Expression,
    changeClassName: string,
    context: string,
  ): string {
    const unwrapped = this.unwrapExpression(expression);

    if (Node.isStringLiteral(unwrapped)) {
      return unwrapped.getLiteralText();
    }

    if (Node.isNoSubstitutionTemplateLiteral(unwrapped)) {
      return unwrapped.getLiteralText();
    }

    throw new Error(
      `Expected a string expression for "${changeClassName}.${context}", got: ${unwrapped.getText()}`,
    );
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
