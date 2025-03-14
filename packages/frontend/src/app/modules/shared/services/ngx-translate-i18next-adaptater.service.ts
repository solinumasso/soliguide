import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

/**
 * This adaptator is a hack to simulate 'i18next' functions
 */
@Injectable({
  providedIn: "root",
})
export class NgxTranslateI18nextAdapter {
  constructor(private readonly translateService: TranslateService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t(key: string, options?: any): string {
    let params = {};

    if (options?.replace) {
      params = options.replace;
    }

    return this.translateService.instant(key, params);
  }

  get language(): string {
    return this.translateService.currentLang;
  }
}
