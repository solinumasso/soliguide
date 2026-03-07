import { ExportFileType } from "../enums";

export const EXPORT_CONTENT_TYPE: { [key in ExportFileType]: string } = {
  WORD: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PDF: "application/pdf",
  CSV: "text/csv; charset=utf-8",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
