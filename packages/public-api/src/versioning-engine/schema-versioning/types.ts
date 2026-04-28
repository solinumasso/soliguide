import { ResourceKind } from "../dsl/changes/runtime";
import { ChangeImpact, ChangeType } from "../dsl/changes/version-change";

export type ParsedChangeMetadata = {
  title?: string;
  description?: string;
  impact?: ChangeImpact;
  groupTitle?: string;
};

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

export type ParsedPatchPayload = {
  payloadPath: string;
};

export type ParsedChangePayloadByType = {
  add: ParsedAddPayload;
  remove: ParsedRemovePayload;
  rename: ParsedRenamePayload;
  replaceSchema: ParsedReplaceSchemaPayload;
  patch: ParsedPatchPayload;
};

export type ParsedChangeDefinition<TType extends ChangeType = ChangeType> = {
  changeName: string;
  type: TType;
  metadata: ParsedChangeMetadata;
  payload: ParsedChangePayloadByType[TType];
  sourceFilePath: string;
};

export type AnyParsedChangeDefinition = {
  [TType in ChangeType]: ParsedChangeDefinition<TType>;
}[ChangeType];

export type ParsedResourceDefinition = {
  resourceName: string;
  kind?: ResourceKind;
  contextProvider?: string;
  changes: AnyParsedChangeDefinition[];
};

export type ParsedVersionDefinition = {
  version: string;
  baseVersion: string;
  description: string;
  sourceFilePath: string;
  resources: ParsedResourceDefinition[];
};
