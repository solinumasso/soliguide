import { Component, Input, OnInit } from "@angular/core";

import {
  faFax,
  faLink,
  faMapMarker,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

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
  // Utilisateur
  public me!: User | null;

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

  public constructor(
    private readonly authService: AuthService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-entity-info");
    this.showEmail = false;
    this.showPhones = false;
    this.showAddress = false;
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;

    this.showAddress =
      !this.place.modalities?.orientation ||
      !this.place.modalities.orientation?.checked ||
      this.me !== null;

    this.updateDefaultPosthogProperties({ addressVisible: this.showAddress });
  }
}
