import { addChangeHandler } from "./add";
import { patchChangeHandler } from "./patch";
import { removeChangeHandler } from "./remove";
import { renameChangeHandler } from "./rename";
import { replaceSchemaChangeHandler } from "./replace-schema";
import { ChangeHandlerRegistry } from "./types";

export const changeHandlers: ChangeHandlerRegistry = {
  add: addChangeHandler,
  patch: patchChangeHandler,
  remove: removeChangeHandler,
  rename: renameChangeHandler,
  replaceSchema: replaceSchemaChangeHandler,
};

export type {
  ChangeApplyContext,
  ChangeHandler,
  ChangeHandlerRegistry,
  ChangeParseContext,
} from "./types";
