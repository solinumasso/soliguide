import { NgComponentOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService } from "../../../shared/services";
import { CookiePolicyService } from "../../services/cookie-policy.service";
import { StaticPagesComponentAbstract } from "../static-pages-component.abstract";
import { combineLatest } from "rxjs";

@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: "app-cookie-policy",
  template: '<ng-container *ngComponentOutlet="currentTemplate" />',
})
export class CookiePolicyComponent
  extends StaticPagesComponentAbstract
  implements OnInit
{
  constructor(
    private readonly translateService: TranslateService,
    private readonly seoService: SeoService,
    private readonly cookiePolicyService: CookiePolicyService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    super();
  }

  public ngOnInit(): void {
    const params = { brandName: THEME_CONFIGURATION.brandName };

    combineLatest([
      this.translateService.stream("STATIC_PAGE_COOKIE_POLICY_TITLE"),
      this.translateService.stream(
        "STATIC_PAGE_COOKIE_POLICY_DESCRIPTION",
        params
      ),
    ]).subscribe(([title, description]) => {
      this.seoService.updateTitleAndTags(title, description, true);
    });

    this.currentTemplate =
      this.cookiePolicyService.getCookiePolicyComponentByName(
        this.theme,
        this.currentLanguageService.currentLanguage
      );
  }
}
