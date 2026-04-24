import { ChangeHandler } from "./types";

export const splitChangeHandler: ChangeHandler<"split"> = {
  apply(context, change) {
    const targetObject = context.resolveChangeObject(
      context.mainSchemaDeclaration,
      change.payload.payloadPath,
      `split ${change.changeName}`
    );

    context
      .requireObjectProperty(
        targetObject,
        change.payload.from,
        `Change ${change.changeName} cannot split missing field ${
          change.payload.payloadPath
        }.${change.payload.from} in ${context.sourceFile.getFilePath()}`
      )
      .remove();

    for (const [newFieldName, schemaExpression] of Object.entries(
      change.payload.to
    )) {
      context.assertPropertyMissing(
        targetObject,
        newFieldName,
        `Change ${change.changeName} cannot split into existing field ${
          change.payload.payloadPath
        }.${newFieldName} in ${context.sourceFile.getFilePath()}`
      );
      context.addObjectProperty(
        targetObject,
        newFieldName,
        schemaExpression.text
      );
    }
  },

  parsePayload(context) {
    return {
      from: context.readRequiredStringProperty(context.payloadObject, "from"),
      payloadPath: context.payloadPath,
      to: context.readSchemaExpressionRecord(
        context.readRequiredObjectProperty(context.payloadObject, "to"),
        `${context.contextLabel} to`
      ),
    };
  },
};
