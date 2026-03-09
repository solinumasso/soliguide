import { Themes } from "@soliguide/common";
import { TypeCategoriesServiceNotFromThemeEnum } from "../../categories/enums/type-categories-service-not-from-theme.enum";

export type TypeCategoriesService =
  | Themes
  | TypeCategoriesServiceNotFromThemeEnum
  | null;
