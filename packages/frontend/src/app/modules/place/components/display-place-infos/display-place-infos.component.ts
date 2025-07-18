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
