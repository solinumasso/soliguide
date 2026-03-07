import { Categories } from "@soliguide/common";

export const CATEGORIES_TITLE: { [key in Categories]?: string } = {
  [Categories.HEALTH]: "CAT_SANTE_TITLE",
  [Categories.PSYCHOLOGICAL_SUPPORT]: "CAT_PSYCHOLOGIE_TITLE",
  [Categories.FRENCH_COURSE]: "CAT_COURS_FRANCAIS_TITLE",
  [Categories.DOMICILIATION]: "CAT_DOMICILIATION_TITLE",
  [Categories.WIFI]: "CAT_WIFI_TITLE",
  [Categories.ELECTRICAL_OUTLETS_AVAILABLE]: "CAT_PRISE_TITLE",
  [Categories.FOOD]: "CAT_ALIMENTATION_TITLE",
  [Categories.DAY_HOSTING]: "CAT_ACCUEIL_JOUR_TITLE",
  [Categories.INFORMATION_POINT]: "CAT_POINT_INFO_TITLE",
  [Categories.CLOTHING]: "CAT_VETEMENTS_TITLE",
};
