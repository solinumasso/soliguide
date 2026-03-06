import { DocExportRow } from "./DocExportRow.interface";

export interface DocExportSection {
  docRows: DocExportRow[];
  sectionImage?: string;
  sectionName: string;
}
