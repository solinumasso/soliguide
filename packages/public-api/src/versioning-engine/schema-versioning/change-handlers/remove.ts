import { ChangeHandler } from "./types";

export const removeChangeHandler: ChangeHandler<"remove"> = {
  apply(context, change) {
    context
      .resolveChangeFieldProperty(
        context.mainSchemaDeclaration,
        change.payload.payloadPath,
        `remove ${change.changeName}`
      )
      .remove();
  },

  parsePayload(context) {
    return {
      payloadPath: context.payloadPath,
    };
  },
};
