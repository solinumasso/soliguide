import { ExpressRequest, FRONT_URLS_MAPPINGS, Origin } from "../../../_models";
import {
  SupportedLanguagesCode,
  type CategoriesService,
  Themes,
} from "@soliguide/common";
import {
  handleLanguageByTheme,
  handleOrigin,
  handleOriginForLogs,
  handleReferer,
} from "../services";
import { getThemeFromOrigin } from "../services/getThemeFromOrigin.service";
import { getServiceCategoriesApi } from "../../../categories/functions/get-service-categories-api.function";

export class RequestInformation {
  public readonly originForLogs: Origin;
  private readonly _originFromRequest: string | null;
  public readonly frontendUrl: string;
  public readonly referer: string | null = null;
  public readonly theme: Themes | null = null;

  public categoryService: CategoriesService;
  public language?: SupportedLanguagesCode;

  constructor(req: ExpressRequest) {
    this.referer = handleReferer(req);
    this._originFromRequest = handleOrigin(req);
    this.originForLogs = handleOriginForLogs(req, this._originFromRequest);
    this.theme = getThemeFromOrigin(this._originFromRequest);

    this.frontendUrl = this.theme
      ? `${FRONT_URLS_MAPPINGS[this.theme]}/`
      : `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/`; // Fallback for urls that are not in the mappings
    this.categoryService = getServiceCategoriesApi(this.theme);
    this.language = handleLanguageByTheme(this.theme);
  }
}
