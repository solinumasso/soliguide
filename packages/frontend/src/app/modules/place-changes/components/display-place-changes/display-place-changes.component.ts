import { Component, Input, OnInit } from "@angular/core";

import {
  CampaignChangesSection,
  PlaceChangesSection,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
} from "@soliguide/common";

import { CAMPAIGN_SOURCE_LABELS } from "../../../../models/campaign";
import { PlaceChangesTypeEdition } from "../../../../models/place-changes";
import { Place } from "../../../../models/place";
import { ServicesChanges } from "../../classes";

@Component({
  selector: "app-display-place-changes",
  templateUrl: "./display-place-changes.component.html",
  styleUrls: ["./display-place-changes.component.scss"],
})
export class DisplayPlaceChangesComponent implements OnInit {
  @Input() public oldPlace!: Place;
  @Input() public placeChanged: Place;
  @Input() public section: PlaceChangesSection | CampaignChangesSection;
  @Input() public photosChanged: boolean;
  @Input() public changesDate: Date;
  @Input() public changeSection: "old" | "new";
  @Input() public typeOfEdition: PlaceChangesTypeEdition;

  public readonly CAMPAIGN_SOURCE_LABELS = CAMPAIGN_SOURCE_LABELS;

  public readonly PlaceChangesSection = PlaceChangesSection;
  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceType = PlaceType;
  public readonly PlaceVisibility = PlaceVisibility;

  public servicesChanges: ServicesChanges = new ServicesChanges([], []);

  ngOnInit(): void {
    if (
      this.section === PlaceChangesSection.services &&
      this.changeSection === "new" &&
      this.oldPlace
    ) {
      this.servicesChanges = new ServicesChanges(
        this.oldPlace.services_all,
        this.placeChanged.services_all
      );
    }
  }
}
