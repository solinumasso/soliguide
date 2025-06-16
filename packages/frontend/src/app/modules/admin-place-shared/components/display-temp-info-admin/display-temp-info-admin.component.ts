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

import { TempInfo, TempInfoType, OpeningHours } from "@soliguide/common";

import { DateService } from "../../../place/services/date.service";

@Component({
  selector: "app-display-temp-info-admin",
  templateUrl: "./display-temp-info-admin.component.html",
  styleUrls: ["./display-temp-info-admin.component.css"],
})
export class DisplayTempInfoAdminComponent implements OnInit {
  @Input() public tempInfo!: TempInfo;

  public openingHours?: OpeningHours;

  public readonly TempInfoType = TempInfoType;

  public dateString: string;

  constructor(private readonly dateService: DateService) {
    this.dateString = "";
  }

  public ngOnInit(): void {
    this.dateString = this.dateService
      .translateDateInterval(this.tempInfo.dateDebut, this.tempInfo.dateFin)
      .toLowerCase();

    if (this.tempInfo.tempInfoType === TempInfoType.HOURS) {
      this.openingHours = new OpeningHours(this.tempInfo.hours, true);
    }
  }
}
