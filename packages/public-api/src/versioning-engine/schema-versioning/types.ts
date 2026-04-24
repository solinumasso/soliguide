import { ChangeType } from "../dsl/version-change";

export type ParsedSchemaExpression = {
  text: string;
  sourceFilePath: string;
};

export type ParsedAddPayload = {
  payloadPath: string;
  field: string;
  schema: ParsedSchemaExpression;
};

export type ParsedRemovePayload = {
  payloadPath: string;
};

export type ParsedRenamePayload = {
  payloadPath: string;
  from: string;
  to: string;
};

export type ParsedReplaceSchemaPayload = {
  payloadPath: string;
  schema: ParsedSchemaExpression;
};

export type ParsedMergePayload = {
  payloadPath: string;
  from: string[];
  to: string;
  schema: ParsedSchemaExpression;
};

export type ParsedSplitPayload = {
  payloadPath: string;
  from: string;
  to: Record<string, ParsedSchemaExpression>;
};

export type ParsedCustomSelector =
  | {
      type: "self";
    }
  | {
      type: "field";
      field: string;
    };

export type ParsedCustomAction =
  | {
      type: "replace";
      schema: ParsedSchemaExpression;
    }
  | {
      type: "insert";
      field: string;
      schema: ParsedSchemaExpression;
    }
  | {
      type: "remove";
      field?: string;
    };

export type ParsedCustomPayload = {
  payloadPath: string;
  selector?: ParsedCustomSelector;
  action: ParsedCustomAction;
};

export type ParsedChangePayloadByType = {
  add: ParsedAddPayload;
  remove: ParsedRemovePayload;
  rename: ParsedRenamePayload;
  replaceSchema: ParsedReplaceSchemaPayload;
  merge: ParsedMergePayload;
  split: ParsedSplitPayload;
  custom: ParsedCustomPayload;
};

export type ParsedChangeDefinition<TType extends ChangeType = ChangeType> = {
  changeName: string;
  type: TType;
  payload: ParsedChangePayloadByType[TType];
  sourceFilePath: string;
};

export type AnyParsedChangeDefinition = {
  [TType in ChangeType]: ParsedChangeDefinition<TType>;
}[ChangeType];

export type ParsedResourceDefinition = {
  resourceName: string;
  changes: AnyParsedChangeDefinition[];
};

export type ParsedVersionDefinition = {
  version: string;
  baseVersion: string;
  description: string;
  sourceFilePath: string;
  resources: ParsedResourceDefinition[];
};
