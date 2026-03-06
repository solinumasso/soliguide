
import { TypeCategoriesServiceNotFromThemeEnum } from "../enums/type-categories-service-not-from-theme.enum";
import { Themes } from "@soliguide/common";

export type TypeCategoriesService =
  | Themes
  | TypeCategoriesServiceNotFromThemeEnum
  | null;
