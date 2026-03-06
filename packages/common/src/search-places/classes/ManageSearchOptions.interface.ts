
import { SortingOrder } from "../enums";

export class ManageSearchOptions {
  public sortBy: string = "createdAt";
  public sortValue = SortingOrder.DESCENDING;
  public limit = 100;
  public page = 1;
  public fields?: string;

  constructor(data?: { options?: Partial<ManageSearchOptions> }) {
    if (data?.options) {
      const options = data.options;
      this.sortBy = options.sortBy ?? "createdAt";
      this.sortValue = options.sortValue ?? SortingOrder.DESCENDING;
      this.limit = options.limit ?? 100;
      this.page = options.page ?? 1;
      this.fields = options.fields ?? undefined;
    }
  }
}
