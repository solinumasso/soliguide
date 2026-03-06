
import { SupportedLanguagesCode } from "../enums";

export type AllSupportedLanguages = {
  [key in SupportedLanguagesCode]: {
    name: string;
    nativeName: string;
  };
};
