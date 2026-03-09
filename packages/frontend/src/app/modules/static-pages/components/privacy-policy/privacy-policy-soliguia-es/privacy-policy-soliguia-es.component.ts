import { Component, OnInit, OnDestroy } from "@angular/core";
import { StaticPagesComponentInterface } from "../../../models";
import { CurrentLanguageService } from "../../../../general/services/current-language.service";
import { getPathFromTheme } from "../../../../../shared/functions/getPathFromTheme";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-privacy-policy-soliguia-es",
  templateUrl: "./privacy-policy-soliguia-es.component.html",
})
export class PrivacyPolicySoliguiaEsComponent
  implements StaticPagesComponentInterface, OnInit, OnDestroy
{
  private readonly subscription: Subscription = new Subscription();

  public cookiePolicyLink: string;
  public routePrefix: string;
  public linkTitle: string;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.cookiePolicyLink = getPathFromTheme("cookie-policy");

    this.linkTitle = this.translateService.instant("COOKIE_POLICY");
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
