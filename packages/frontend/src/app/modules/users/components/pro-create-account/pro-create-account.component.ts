import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { THEME_CONFIGURATION } from "src/app/models";
import { CurrentLanguageService } from "src/app/modules/general/services/current-language.service";

@Component({
  selector: "app-pro-create-account",
  templateUrl: "./pro-create-account.component.html",
  styleUrls: ["./pro-create-account.component.css"],
})
export class ProCreateAccountComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public routePrefix = "";

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly titleService: Title,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.translateService
        .stream("SIGNUP_SOLIGUIDE", {
          brandName: THEME_CONFIGURATION.brandName,
        })
        .subscribe((translatedTitle: string) => {
          this.titleService.setTitle(translatedTitle);
        })
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
