import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import {
  CampaignInfos,
  PlaceClosedHolidays,
  PlaceStatus,
  TempInfoType,
} from "@soliguide/common";

import { Subscription } from "rxjs";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";

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
  @Input() public me!: User | null;

  private readonly subscription = new Subscription();

  public routePrefix: string;
  public PlaceClosedHolidays = PlaceClosedHolidays;

  public readonly PlaceStatus = PlaceStatus;
  public readonly TempInfoType = TempInfoType;

  public haveRightOnThisPlace: boolean;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-place-info");

    this.routePrefix = this.currentLanguageService.routePrefix;

    this.haveRightOnThisPlace = false;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.haveRightOnThisPlace = this.me?.places.includes(this.place.lieu_id);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
