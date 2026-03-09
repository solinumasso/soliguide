import { Themes } from "@soliguide/common";

type PathStaticPageTypeBasic = {
  [keyPath: string]: {
    [theme in Themes]: string;
  };
};

export type PathStaticPageType = Required<PathStaticPageTypeBasic> & {
  [keyPath: string]: {
    [Themes.SOLIGUIDE_FR]: string;
    [Themes.SOLIGUIA_AD]: string;
    [Themes.SOLIGUIA_ES]: string;
  };
};
