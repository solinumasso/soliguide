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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { TempInfoType, BasePlaceTempInfos } from "@soliguide/common";

import { DateService } from "../../services/date.service";

import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-temp-banner",
  templateUrl: "./display-temp-banner.component.html",
  styleUrls: ["./display-temp-banner.component.css"],
})
export class DisplayTempBannerComponent
  extends PosthogComponent
  implements OnInit
{
  @Input() public tempInfoType!: TempInfoType;

  @Input() public tempInfos!: BasePlaceTempInfos;
  @Input() public displayTempHours?: boolean;
  @Input() public admin?: boolean;
  @Input() public displayHoursWhenTempClosed?: boolean;

  @Output() public readonly displayTempHoursEvent = new EventEmitter<boolean>();
  @Output() public readonly displayRegularHoursEvent = new EventEmitter();

  public dateString: string;

  public readonly TempInfoType = TempInfoType;

  constructor(
    private readonly dateService: DateService,
    posthogService: PosthogService
  ) {
    super(posthogService, "display-banner-temp-infos");
    this.dateString = "";
  }

  public ngOnInit(): void {
    this.updateDefaultPosthogProperties({
      tempInfoType: this.tempInfoType,
      tempInfo: this.tempInfos,
    });

    this.dateString = this.dateService
      .translateDateInterval(this.tempInfos.dateDebut, this.tempInfos.dateFin)
      .toLowerCase();
  }

  public toogleDisplayTempHours = (value: boolean): void => {
    this.captureEvent({
      name: "click-toggle-temp-hours",
      properties: { areTempHoursDisplayedNow: value },
    });

    this.displayTempHours = value;
    this.displayTempHoursEvent.emit(value);
  };

  public displayRegularHours = (): void => {
    this.captureEvent({
      name: "click-display-regular-hours",
      properties: { areRegularsHoursDisplayedNow: true },
    });

    this.displayRegularHoursEvent.emit();
  };
}
