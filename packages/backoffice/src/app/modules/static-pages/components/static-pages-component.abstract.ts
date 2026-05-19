import type { Type } from "@angular/core";

import type { StaticPagesComponentInterface } from "../models";
import { themeService } from "../../../shared";

export abstract class StaticPagesComponentAbstract {
  public currentTemplate: Type<StaticPagesComponentInterface>;
  protected theme = themeService.getTheme();
}
