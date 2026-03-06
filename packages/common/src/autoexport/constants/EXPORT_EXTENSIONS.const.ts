import { ExportFileType } from "../enums";

export const EXPORT_EXTENSIONS: { [key in ExportFileType]: string } = {
  CSV: ".csv",
  PDF: ".pdf",
  XLSX: ".xlsx",
  WORD: ".docx",
};
