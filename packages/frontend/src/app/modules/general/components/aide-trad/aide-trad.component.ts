import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { CurrentLanguageService } from "../../services/current-language.service";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-aide-trad",
  templateUrl: "./aide-trad.component.html",
  styleUrls: ["./aide-trad.component.css"],
})
export class AideTradComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public routePrefix: string;

  constructor(
    private readonly titleService: Title,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.titleService.setTitle(
      this.translateService.instant("WELCOME_TO_TRANSLATION_PLATFORM", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
