import {
  Expression,
  ObjectLiteralExpression,
  PropertyAssignment,
  SourceFile,
  VariableDeclaration,
} from "ts-morph";

import { ChangeType } from "../../dsl/version-change";
import {
  ParsedChangeDefinition,
  ParsedChangePayloadByType,
  ParsedSchemaExpression,
} from "../types";

export interface ChangeParseContext {
  contextLabel: string;
  payloadObject: ObjectLiteralExpression;
  payloadPath: string;
  readOptionalObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ObjectLiteralExpression | undefined;
  readOptionalStringProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string | undefined;
  readRequiredObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ObjectLiteralExpression;
  readRequiredSchemaExpression(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): ParsedSchemaExpression;
  readRequiredStringArrayProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string[];
  readRequiredStringProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string
  ): string;
  readSchemaExpressionRecord(
    objectLiteral: ObjectLiteralExpression,
    contextLabel: string
  ): Record<string, ParsedSchemaExpression>;
}

export interface ChangeApplyContext {
  addObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    initializer: string
  ): void;
  assertPropertyMissing(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    errorMessage: string
  ): void;
  mainSchemaDeclaration: VariableDeclaration;
  readPropertyInitializer(
    property: PropertyAssignment,
    errorMessage: string
  ): Expression;
  requireObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    errorMessage: string
  ): PropertyAssignment;
  resolveChangeFieldProperty(
    mainSchemaDeclaration: VariableDeclaration,
    payloadPath: string,
    context: string
  ): PropertyAssignment;
  resolveChangeObject(
    mainSchemaDeclaration: VariableDeclaration,
    payloadPath: string,
    context: string
  ): ObjectLiteralExpression;
  setOrAddObjectProperty(
    objectLiteral: ObjectLiteralExpression,
    propertyName: string,
    initializer: string
  ): void;
  sourceFile: SourceFile;
}

export interface ChangeHandler<TType extends ChangeType> {
  apply(
    context: ChangeApplyContext,
    change: ParsedChangeDefinition<TType>
  ): void;
  parsePayload(context: ChangeParseContext): ParsedChangePayloadByType[TType];
}

export type ChangeHandlerRegistry = {
  [TType in ChangeType]: ChangeHandler<TType>;
};
