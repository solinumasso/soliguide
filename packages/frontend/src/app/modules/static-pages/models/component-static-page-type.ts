import { Type } from "@angular/core";
import { Themes, SupportedLanguagesCode } from "@soliguide/common";
import { StaticPagesComponentInterface } from "./static-pages-component.interface";

export type componentStaticPage = {
  theme: Themes;
  lang: SupportedLanguagesCode;
  component: Type<StaticPagesComponentInterface>;
  defaultTheme: boolean;
  default: boolean;
};
