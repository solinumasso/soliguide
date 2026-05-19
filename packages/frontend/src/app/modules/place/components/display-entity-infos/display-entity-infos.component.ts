import { Component, Input, OnInit } from "@angular/core";

import {
  faFax,
  faLink,
  faMapMarker,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { Place } from "../../../../models/place/classes";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { PlaceType } from "@soliguide/common";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-entity-infos",
  templateUrl: "./display-entity-infos.component.html",
  styleUrls: ["./display-entity-infos.component.scss"],
})
export class DisplayEntityInfosComponent
  extends PosthogComponent
  implements OnInit
{
  @Input() public place!: Place;

  // Affichage
  public showEmail: boolean;
  public showPhones: boolean;
  public showAddress: boolean;

  public readonly faMapMarker = faMapMarker;
  public readonly faFax = faFax;
  public readonly faPhone = faPhone;
  public readonly faLink = faLink;
  public readonly faEnvelope = faEnvelope;

  public readonly PlaceType = PlaceType;

  public constructor(posthogService: PosthogService) {
    super(posthogService, "display-entity-info");
    this.showEmail = false;
    this.showPhones = false;
    this.showAddress = false;
  }

  public ngOnInit(): void {
    this.showAddress =
      !this.place.modalities?.orientation ||
      !this.place.modalities.orientation?.checked;

    this.updateDefaultPosthogProperties({ addressVisible: this.showAddress });
  }
}
