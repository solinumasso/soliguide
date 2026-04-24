import { ChangeHandler } from "./types";

export const mergeChangeHandler: ChangeHandler<"merge"> = {
  apply(context, change) {
    const targetObject = context.resolveChangeObject(
      context.mainSchemaDeclaration,
      change.payload.payloadPath,
      `merge ${change.changeName}`
    );

    for (const fieldName of change.payload.from) {
      context
        .requireObjectProperty(
          targetObject,
          fieldName,
          `Change ${change.changeName} cannot merge missing field ${
            change.payload.payloadPath
          }.${fieldName} in ${context.sourceFile.getFilePath()}`
        )
        .remove();
    }

    context.setOrAddObjectProperty(
      targetObject,
      change.payload.to,
      change.payload.schema.text
    );
  },

  parsePayload(context) {
    return {
      from: context.readRequiredStringArrayProperty(
        context.payloadObject,
        "from"
      ),
      payloadPath: context.payloadPath,
      schema: context.readRequiredSchemaExpression(
        context.payloadObject,
        "schema"
      ),
      to: context.readRequiredStringProperty(context.payloadObject, "to"),
    };
  },
};
