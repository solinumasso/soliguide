import { AnyDepartmentCode } from "@soliguide/common";
import { Search } from "../../search/interfaces";

export class SearchPairing extends Search {
  public sources: string[];
  public territories: AnyDepartmentCode[];

  constructor(search?: Partial<SearchPairing>) {
    super(search);
    this.sources = search?.sources ?? [];
    this.territories = search?.territories ?? [];
  }
}
