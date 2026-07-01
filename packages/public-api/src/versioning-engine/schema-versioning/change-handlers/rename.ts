import { ChangeHandler } from "./types";

export const renameChangeHandler: ChangeHandler<"rename"> = {
  apply(context, change) {
    const targetObject = context.resolveChangeObject(
      change.payload.payloadPath,
      `rename ${change.changeName}`
    );
    const fromProperty = context.requireObjectProperty(
      targetObject,
      change.payload.from,
      `Change ${change.changeName} cannot rename missing field ${
        change.payload.payloadPath
      }.${change.payload.from} in ${context.sourceFile.getFilePath()}`
    );

    context.assertPropertyMissing(
      targetObject,
      change.payload.to,
      `Change ${change.changeName} cannot rename ${
        change.payload.payloadPath
      }.${change.payload.from} to existing field ${
        change.payload.to
      } in ${context.sourceFile.getFilePath()}`
    );

    fromProperty.replaceWithText(
      `${change.payload.to}: ${context
        .readPropertyInitializer(
          fromProperty,
          `Change ${change.changeName} cannot rename field ${change.payload.payloadPath}.${change.payload.from}: missing initializer`
        )
        .getText()}`
    );
  },

  parsePayload(context) {
    return {
      from: context.readRequiredStringProperty(context.payloadObject, "from"),
      payloadPath: context.payloadPath,
      to: context.readRequiredStringProperty(context.payloadObject, "to"),
    };
  },
};
