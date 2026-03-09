import {
  SupportedLanguagesCode,
  CountryCodes,
  Phone,
  parsePhoneNumber,
} from "@soliguide/common";

import i18next from "i18next";

export const parsePhones = (
  language: SupportedLanguagesCode,
  phones?: Phone[]
): string => {
  if (!phones?.length) {
    return i18next.t("EXPORTS_NO_PHONE", { lng: language });
  }

  let phonesString = "";

  for (let i = 0; i < phones.length; i++) {
    const label = phones[i]?.label;
    if (label) {
      phonesString += `${label.trim()}: `;
    }

    if (phones[i].phoneNumber) {
      phonesString += parsePhoneNumber(phones[i], CountryCodes.FR);
    }

    if (i + 1 < phones.length) {
      phonesString += "\n";
    }
  }
  return phonesString.trim();
};
