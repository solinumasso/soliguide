import {
  TranslatedFieldElement,
  TranslatedFieldStatus,
} from "@soliguide/common";

import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchTranslatedFields extends ManageSearch {
  public createdAt?: Date;
  public elementName?: TranslatedFieldElement;
  public lieu_id?: string;
  public status?: TranslatedFieldStatus;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.createdAt = data?.createdAt ?? null;
    this.status = data?.status ?? null;
    this.elementName = data?.elementName ?? null;
    this.lieu_id = typeof data?.lieu_id === "number" ? data.lieu_id : null;
  }
}
