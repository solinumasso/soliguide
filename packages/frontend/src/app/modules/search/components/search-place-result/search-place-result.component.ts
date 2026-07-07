import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { format } from "date-fns";
import { Subscription } from "rxjs";

import {
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  TempInfoType,
  PlaceVisibility,
  GeoTypes,
  PlaceOpeningStatus,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { Place } from "../../../../models/place";
import { fadeInOut } from "../../../../shared/animations";
import { PosthogService } from "../../../analytics/services/posthog.service";
import type { Search } from "../../interfaces";

@Component({
  animations: [fadeInOut],
  selector: "app-search-place-result",
  templateUrl: "./search-place-result.component.html",
  styleUrls: [
    "./search-place-result.component.css",
    "../search/search.component.scss",
  ],
})
export class SearchPlaceResultComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  @Input() public place: Place;
  @Input() public search: Search;
  @Input() public placeIndex: number;

  public routePrefix: string;

  public todayDate: Date;
  public today: string;
  public isPhoneNumberVisible: boolean[] = [];

  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceVisibility = PlaceVisibility;
  public readonly PlaceClosedHolidays = PlaceClosedHolidays;
  public readonly TempInfoType = TempInfoType;
  public readonly PlaceType = PlaceType;
  public readonly GeoTypes = GeoTypes;
  public readonly PlaceOpeningStatus = PlaceOpeningStatus;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.todayDate = new Date();
    this.today = format(this.todayDate, "EEEE").toLowerCase();
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

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`search-place-result-${eventName}`, {
      ...properties,
      search: this.search,
    });
  }

  public get hasAirConditioningRibbon(): boolean {
    return (
      typeof this.place?.modalities?.thermalComfort?.airConditioned ===
      "boolean"
    );
  }

  public togglePhoneNumber(phoneIndex: number): void {
    this.isPhoneNumberVisible[phoneIndex] =
      !this.isPhoneNumberVisible[phoneIndex];
  }
}
