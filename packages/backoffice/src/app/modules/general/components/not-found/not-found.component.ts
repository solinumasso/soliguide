import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { CurrentLanguageService } from "../../services/current-language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-not-found",
  styleUrls: ["./not-found.component.css"],
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;

  constructor(
    private readonly titleService: Title,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("NON_EXISTANT_PAGE")
    );
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
