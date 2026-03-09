import { ManageSearchOptions } from "@soliguide/common";
import { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class SearchTranslatedPlace extends ManageSearch {
  public lieu_id?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, user: User) {
    super(data, user);
    this.lieu_id = data?.lieu_id ?? null;
    this.options = new ManageSearchOptions(data);
  }
}
