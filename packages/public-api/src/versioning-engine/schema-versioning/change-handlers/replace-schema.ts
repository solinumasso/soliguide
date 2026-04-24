import { ChangeHandler } from "./types";

export const replaceSchemaChangeHandler: ChangeHandler<"replaceSchema"> = {
  apply(context, change) {
    context
      .resolveChangeFieldProperty(
        context.mainSchemaDeclaration,
        change.payload.payloadPath,
        `replaceSchema ${change.changeName}`
      )
      .setInitializer(change.payload.schema.text);
  },

  parsePayload(context) {
    return {
      payloadPath: context.payloadPath,
      schema: context.readRequiredSchemaExpression(
        context.payloadObject,
        "schema"
      ),
    };
  },
};
