import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import {
  CampaignInfos,
  PlaceClosedHolidays,
  PlaceStatus,
  TempInfoType,
} from "@soliguide/common";

import { Subscription } from "rxjs";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { Place } from "../../../../models/place";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-place-infos",
  templateUrl: "./display-place-infos.component.html",
  styleUrls: ["./display-place-infos.component.css"],
})
export class DisplayPlaceInfosComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  @Input() public place!: Place;
  @Input() public canEdit!: boolean;
  @Input() public maj!: CampaignInfos;
  @Input() public dateForTest!: Date;

  private readonly subscription = new Subscription();

  public routePrefix: string;
  public PlaceClosedHolidays = PlaceClosedHolidays;

  public readonly PlaceStatus = PlaceStatus;
  public readonly TempInfoType = TempInfoType;

  public readonly haveRightOnThisPlace = false;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-place-info");

    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
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
