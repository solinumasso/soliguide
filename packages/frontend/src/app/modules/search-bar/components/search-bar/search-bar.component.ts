import { Component, EventEmitter, Input, Output } from "@angular/core";

import type { LocationAutoCompleteAddress } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";
import { Search } from "../../../search/interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent {
  @Input({ required: true }) public search: Search;
  @Input() public currentValue!: string;
  // Selected category
  @Output()
  public readonly updateCategory = new EventEmitter<void>();
  // Searched location
  @Output()
  public readonly updateLocation =
    new EventEmitter<LocationAutoCompleteAddress>();

  // Search launched
  @Output()
  public readonly launchSearch = new EventEmitter<void>();

  constructor(private readonly posthogService: PosthogService) {}

  public localLaunchSearch() {
    this.launchSearch.emit();
    this.captureEvent("search-input", { search: this.search });
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(
      `home-search-bar-${eventName.toLocaleLowerCase()}`,
      { ...properties }
    );
  }
}
