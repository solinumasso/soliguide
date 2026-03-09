import { REGEXP } from "@soliguide/common";

export const formatPhoneNumber = (str: string): string | null => {
  const cleanedPhone = str ? str.replace(/[^+\d]/g, "") : null;
  return cleanedPhone && new RegExp(REGEXP.phone).exec(cleanedPhone)
    ? cleanedPhone
    : null;
};
