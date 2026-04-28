import { ChangeHandler } from "./types";

export const patchChangeHandler: ChangeHandler<"patch"> = {
  apply(_context, change) {
    throw new Error(
      `Patch group ${change.changeName} must be flattened before applying schema changes`
    );
  },

  parsePayload(context) {
    return {
      payloadPath: context.payloadPath,
    };
  },
};
