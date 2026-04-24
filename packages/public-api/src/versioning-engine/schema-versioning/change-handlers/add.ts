import { ChangeHandler } from "./types";

export const addChangeHandler: ChangeHandler<"add"> = {
  apply(context, change) {
    const targetObject = context.resolveChangeObject(
      context.mainSchemaDeclaration,
      change.payload.payloadPath,
      `add ${change.changeName}`
    );

    context.assertPropertyMissing(
      targetObject,
      change.payload.field,
      `Change ${change.changeName} cannot add existing field ${
        change.payload.payloadPath
      }.${change.payload.field} in ${context.sourceFile.getFilePath()}`
    );
    context.addObjectProperty(
      targetObject,
      change.payload.field,
      change.payload.schema.text
    );
  },

  parsePayload(context) {
    return {
      field: context.readRequiredStringProperty(context.payloadObject, "field"),
      payloadPath: context.payloadPath,
      schema: context.readRequiredSchemaExpression(
        context.payloadObject,
        "schema"
      ),
    };
  },
};
