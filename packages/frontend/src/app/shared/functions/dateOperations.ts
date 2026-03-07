import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { formatEn } from "../bootstrap-util";

export const convertNgbDateToDate = (
  dateToConvert: NgbDateStruct | null,
  dateToCompare: NgbDateStruct | null,
  compareToWhich: "start" | "end"
): Date | null => {
  const dateToConvertString = dateToConvert ? formatEn(dateToConvert) : "";
  const dateToCompareString = dateToCompare ? formatEn(dateToCompare) : "";

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(dateToConvertString) &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateToCompareString)
  ) {
    if (dateToConvertString === dateToCompareString) {
      return compareToWhich === "end"
        ? new Date(dateToConvertString)
        : new Date(`${dateToConvertString}T23:59:59`);
    }
    return new Date(dateToConvertString);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateToConvertString)) {
    return new Date(dateToConvertString);
  }

  return null;
};
