import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import {
  getPosition,
  type SoliguideCountries,
  CountryCodes,
  getDepartmentCodeFromPostalCode,
  isFromExternalSource,
} from "@soliguide/common";
import { campaignIsActiveWithTheme } from "../../../../shared";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Place, THEME_CONFIGURATION } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-external-source-place-campaign-banner",
  templateUrl: "./external-source-place-campaign-banner.component.html",
  styleUrls: ["./external-source-place-campaign-banner.component.css"],
})
export class ExternalSourcePlaceCampaignBannerComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  @Input() public canEdit!: boolean;
  @Input() public place!: Place;

  public shouldShowExternalBanner = false;
  public routePrefix: string;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "update-campaign-banner");
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const position = getPosition(this.place);
    const postalCode = position.postalCode;
    const country = position.country;

    const campaignIsActiveForPlace =
      country &&
      postalCode &&
      THEME_CONFIGURATION.country === CountryCodes.FR &&
      campaignIsActiveWithTheme([
        getDepartmentCodeFromPostalCode(
          country as SoliguideCountries,
          postalCode
        ),
      ]);

    this.shouldShowExternalBanner =
      isFromExternalSource(this.place) && campaignIsActiveForPlace;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
