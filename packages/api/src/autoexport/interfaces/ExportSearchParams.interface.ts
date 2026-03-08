import { PlaceSearchForAdmin, ExportParams } from "@soliguide/common";
export interface ExportSearchParams extends PlaceSearchForAdmin {
  exportParams: ExportParams;
  options: {
    sortBy?: string;
    sortValue?: string;
    limit?: number | null;
    page?: number | null;
    skip?: number | null;
    sort?: Record<string, 1 | -1>;
  };
}
