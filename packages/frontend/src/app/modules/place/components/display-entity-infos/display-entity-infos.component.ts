/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
