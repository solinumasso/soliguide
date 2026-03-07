import { Component, OnInit, OnDestroy } from "@angular/core";
import { StaticPagesComponentInterface } from "../../../models";
import { CurrentLanguageService } from "../../../../general/services/current-language.service";
import { getPathFromTheme } from "../../../../../shared/functions/getPathFromTheme";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-gcu-soliguide-fr",
  templateUrl: "./gcu-soliguide-fr.component.html",
})
export class GcuSoliguideFrComponent
  implements StaticPagesComponentInterface, OnInit, OnDestroy
{
  private readonly subscription: Subscription = new Subscription();

  public dataProcessingAgreementLink: string;
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
    this.dataProcessingAgreementLink = getPathFromTheme(
      "data-processing-agreement"
    );

    this.linkTitle = this.translateService.instant("COOKIE_POLICY");
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
