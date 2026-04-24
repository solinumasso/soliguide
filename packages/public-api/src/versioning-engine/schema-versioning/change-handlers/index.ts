import { addChangeHandler } from "./add";
import { customChangeHandler } from "./custom";
import { mergeChangeHandler } from "./merge";
import { removeChangeHandler } from "./remove";
import { renameChangeHandler } from "./rename";
import { replaceSchemaChangeHandler } from "./replace-schema";
import { splitChangeHandler } from "./split";
import { ChangeHandlerRegistry } from "./types";

export const changeHandlers: ChangeHandlerRegistry = {
  add: addChangeHandler,
  custom: customChangeHandler,
  merge: mergeChangeHandler,
  remove: removeChangeHandler,
  rename: renameChangeHandler,
  replaceSchema: replaceSchemaChangeHandler,
  split: splitChangeHandler,
};

export type {
  ChangeApplyContext,
  ChangeHandler,
  ChangeHandlerRegistry,
  ChangeParseContext,
} from "./types";
