// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
export enum CountryCodes {
  // For France, we will use only "fr"
  FR = "fr",
  RE = "re",
  GF = "gf",
  PF = "pf",
  TF = "tf",
  GP = "gp",
  MQ = "mq",
  YT = "yt",
  BL = "bl",
  MF = "mf",
  PM = "pm",
  WF = "wf",
  // Spain
  ES = "es",
  // Andorra
  AD = "ad",
}

export type SoliguideCountries =
  | CountryCodes.ES
  | CountryCodes.FR
  | CountryCodes.AD;
