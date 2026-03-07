import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  PlaceStatus,
  getDepartmentCodeFromPostalCode,
  type SoliguideCountries,
  CountryCodes,
  getPosition,
} from "@soliguide/common";

import { Subscription } from "rxjs";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { Place, THEME_CONFIGURATION } from "../../../../models";

import {
  campaignIsActiveWithTheme,
  DEFAULT_MODAL_OPTIONS,
} from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";

@Component({
  selector: "app-place-update-campaign-banner",
  templateUrl: "./place-update-campaign-banner.component.html",
  styleUrls: ["./place-update-campaign-banner.component.css"],
})
export class PlaceUpdateCampaignBannerComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  @Input() public canEdit: boolean;
  @Input() public place!: Place;

  public loading: boolean;
  public needUpdate: boolean;
  public routePrefix: string;

  public campaignIsActive: boolean;

  public readonly CAMPAIGN_DATE_DEBUT_AFFICHAGE =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutAffichage;

  @ViewChild("noChangeModal", { static: true })
  public noChangeModal!: TemplateRef<NgbModalRef>;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly modalService: NgbModal,
    posthogService: PosthogService
  ) {
    super(posthogService, "update-campaign-banner");
    this.campaignIsActive = false;
    this.needUpdate = false;
    this.loading = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    const now = new Date();

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const position = getPosition(this.place);
    const postalCode = position.postalCode;
    const country = position.country;

    this.campaignIsActive =
      country && postalCode && THEME_CONFIGURATION.country === CountryCodes.FR
        ? campaignIsActiveWithTheme([
            getDepartmentCodeFromPostalCode(
              country as SoliguideCountries,
              postalCode
            ),
          ])
        : false;

    this.updateDefaultPosthogProperties({
      campaign: this.campaignIsActive ? CAMPAIGN_DEFAULT_NAME : null,
      campaignIsActive: this.campaignIsActive,
      place: this.place,
    });

    const remindMeDateSaved = this.place.campaigns.runningCampaign.remindMeDate
      ? new Date(
          `${this.place.campaigns.runningCampaign.remindMeDate}`
        ).getTime()
      : 0;

    // Needs an update if
    // - my place is online
    // - is not definitively closed
    // - hasn't gotten an update using the form
    // - has no remindMe in the future
    // - my update date is lower than the campaign activation date
    this.needUpdate =
      [PlaceStatus.ONLINE, PlaceStatus.OFFLINE].includes(this.place.status) &&
      !(
        this.place.campaigns.runningCampaign.general.updated ||
        remindMeDateSaved >= now.getTime()
      );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openNoChangeModal(): void {
    this.captureEvent({ name: "click-no-change-button-banner" });

    this.modalService.open(this.noChangeModal, DEFAULT_MODAL_OPTIONS);
  }
}
