import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { CommonUser, PlaceStatus, UserStatus } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { AdminCampaignsService } from "../../services/admin-campaigns.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";

// Deux formats de lien selon le scope :
//   - user : lien PUBLIC borné par `campaignUserUuid` (le lien envoyé aux
//     20k users par mail Brevo). Route `campaign-temp-forms/*`.
//   - orga : lien ADMIN scopé `orga._id`. Route `campaign/climate-summer/*`.
// Les deux sont conditionnels au fait qu'il y ait une campagne canicule
// active pour le pays courant, résolu via `AdminCampaignsService`
// (`shareReplay(1)` → 1 GET quelle que soit la taille de la table).
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    NgbTooltipModule,
  ],
  selector: "app-campaign-heatwave-link",
  templateUrl: "./campaign-heatwave-link.component.html",
})
export class CampaignHeatwaveLinkComponent implements OnInit, OnDestroy {
  @Input() public user?: Pick<
    CommonUser,
    "status" | "verified" | "campaignUserUuid" | "user_id"
  > | null;
  @Input() public orga?: {
    _id: string;
    organization_id?: number;
    places?: { status?: PlaceStatus | string }[];
  } | null;

  public campaignSlug: string | null = null;
  public routePrefix: string;

  public readonly UserStatus = UserStatus;

  private readonly subscription = new Subscription();

  constructor(
    private readonly adminCampaignsService: AdminCampaignsService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.adminCampaignsService
        .getCurrentHeatwaveCampaignSlug$()
        .subscribe((slug) => (this.campaignSlug = slug))
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get isVisible(): boolean {
    if (!this.campaignSlug) {
      return false;
    }
    if (this.user) {
      // On garde volontairement en dehors de la condition l'info "au moins un
      // lieu ONLINE" pour le user : le search `MANAGE_USERS` ne remonte pas
      // les places des orgas populées. Filtrer + PRO + verified + uuid est
      // le filtre le plus strict qu'on puisse appliquer côté client. Un user
      // qui n'a aucun lieu à update verra `NO_PLACES_TO_UPDATE` sur la page.
      return (
        this.user.status === UserStatus.PRO &&
        this.user.verified === true &&
        !!this.user.campaignUserUuid
      );
    }
    if (this.orga) {
      return (
        !!this.orga._id &&
        Array.isArray(this.orga.places) &&
        this.orga.places.some((place) => place?.status === PlaceStatus.ONLINE)
      );
    }
    return false;
  }

  public get routerLink(): (string | number)[] | null {
    if (!this.campaignSlug) {
      return null;
    }
    if (this.user?.campaignUserUuid) {
      return [
        this.routePrefix,
        "campaign-temp-forms",
        "campaign-climate-summer",
        this.campaignSlug,
        this.user.campaignUserUuid,
      ];
    }
    if (this.orga?._id) {
      return [
        this.routePrefix,
        "campaign",
        "climate-summer",
        this.campaignSlug,
        "orga",
        this.orga._id,
      ];
    }
    return null;
  }

  public onClick(): void {
    const scope = this.user ? "user" : "orga";
    const properties: PosthogProperties = {
      scope,
      campaignSlug: this.campaignSlug,
    };
    if (this.user) {
      properties.user_id = this.user.user_id;
    } else if (this.orga) {
      properties.organizationId = this.orga._id;
      properties.organization_id = this.orga.organization_id;
    }
    this.posthogService.capture("campaign-heatwave-link-click", properties);
  }
}
