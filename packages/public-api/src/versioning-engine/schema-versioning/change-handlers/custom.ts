import { CustomAction, CustomSelector } from "../../dsl/version-change";
import { ParsedCustomAction, ParsedCustomSelector } from "../types";
import { ChangeHandler, ChangeParseContext } from "./types";

const SUPPORTED_CUSTOM_SELECTOR_TYPES: ReadonlySet<CustomSelector["type"]> =
  new Set(["self", "field"]);
const SUPPORTED_CUSTOM_ACTION_TYPES: ReadonlySet<CustomAction["type"]> =
  new Set(["replace", "insert", "remove"]);

export const customChangeHandler: ChangeHandler<"custom"> = {
  apply(context, change) {
    const action = change.payload.action;

    if (action.type === "insert") {
      const targetObject = context.resolveChangeObject(
        context.mainSchemaDeclaration,
        change.payload.payloadPath,
        `custom/insert ${change.changeName}`
      );

      context.assertPropertyMissing(
        targetObject,
        action.field,
        `Change ${change.changeName} cannot custom-insert existing field ${change.payload.payloadPath}.${action.field}`
      );
      context.addObjectProperty(targetObject, action.field, action.schema.text);
      return;
    }

    if (action.type === "remove") {
      const targetFieldName =
        action.field ??
        (change.payload.selector?.type === "field"
          ? change.payload.selector.field
          : null);

      if (!targetFieldName) {
        context
          .resolveChangeFieldProperty(
            context.mainSchemaDeclaration,
            change.payload.payloadPath,
            `custom/remove ${change.changeName}`
          )
          .remove();
        return;
      }

      context
        .requireObjectProperty(
          context.resolveChangeObject(
            context.mainSchemaDeclaration,
            change.payload.payloadPath,
            `custom/remove ${change.changeName}`
          ),
          targetFieldName,
          `Change ${change.changeName} cannot custom-remove missing field ${change.payload.payloadPath}.${targetFieldName}`
        )
        .remove();
      return;
    }

    if (change.payload.selector?.type === "field") {
      context
        .requireObjectProperty(
          context.resolveChangeObject(
            context.mainSchemaDeclaration,
            change.payload.payloadPath,
            `custom/replace ${change.changeName}`
          ),
          change.payload.selector.field,
          `Change ${change.changeName} cannot custom-replace missing field ${change.payload.payloadPath}.${change.payload.selector.field}`
        )
        .setInitializer(action.schema.text);
      return;
    }

    context
      .resolveChangeFieldProperty(
        context.mainSchemaDeclaration,
        change.payload.payloadPath,
        `custom/replace ${change.changeName}`
      )
      .setInitializer(action.schema.text);
  },

  parsePayload(context) {
    const selectorObject = context.readOptionalObjectProperty(
      context.payloadObject,
      "selector"
    );

    return {
      action: readCustomAction(
        context.readRequiredObjectProperty(context.payloadObject, "action"),
        context
      ),
      payloadPath: context.payloadPath,
      selector: selectorObject
        ? readCustomSelector(selectorObject, context)
        : undefined,
    };
  },
};

function readCustomSelector(
  selectorObject: ChangeParseContext["payloadObject"],
  context: ChangeParseContext
): ParsedCustomSelector {
  const selectorType = context.readRequiredStringProperty(
    selectorObject,
    "type"
  );

  if (
    !SUPPORTED_CUSTOM_SELECTOR_TYPES.has(selectorType as CustomSelector["type"])
  ) {
    throw new Error(
      `${context.contextLabel} selector.type must be one of ${Array.from(
        SUPPORTED_CUSTOM_SELECTOR_TYPES
      ).join(", ")}`
    );
  }

  if (selectorType === "self") {
    return {
      type: "self",
    };
  }

  return {
    field: context.readRequiredStringProperty(selectorObject, "field"),
    type: "field",
  };
}

function readCustomAction(
  actionObject: ChangeParseContext["payloadObject"],
  context: ChangeParseContext
): ParsedCustomAction {
  const actionType = context.readRequiredStringProperty(actionObject, "type");

  if (!SUPPORTED_CUSTOM_ACTION_TYPES.has(actionType as CustomAction["type"])) {
    throw new Error(
      `${context.contextLabel} action.type must be one of ${Array.from(
        SUPPORTED_CUSTOM_ACTION_TYPES
      ).join(", ")}`
    );
  }

  switch (actionType) {
    case "replace":
      return {
        schema: context.readRequiredSchemaExpression(actionObject, "schema"),
        type: "replace",
      };
    case "insert":
      return {
        field: context.readRequiredStringProperty(actionObject, "field"),
        schema: context.readRequiredSchemaExpression(actionObject, "schema"),
        type: "insert",
      };
    case "remove":
      return {
        field: context.readOptionalStringProperty(actionObject, "field"),
        type: "remove",
      };
    default:
      throw new Error(`${context.contextLabel} action.type is unsupported`);
  }
}
