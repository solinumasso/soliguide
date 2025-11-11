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
  filterDepartmentsForHolidays,
  PlaceClosedHolidays,
  PublicHoliday,
} from "@soliguide/common";
import { Search } from "../../../search/interfaces";
import { Subscription } from "rxjs";
import { HolidaysService } from "../../services/holidays.service";
import { Place } from "../../../../models";
import { CommonModule } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  selector: "app-display-holidays",
  templateUrl: "./display-holidays.component.html",
  styleUrls: ["./display-holidays.component.scss"],
})
export class DisplayHolidaysComponent implements OnInit {
  public holidays: PublicHoliday[] = [];
  private readonly subscription: Subscription = new Subscription();
  public readonly PlaceClosedHolidays = PlaceClosedHolidays;

  @Input() public search: Search;
  @Input() public place!: Place;

  constructor(private readonly holidayService: HolidaysService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.holidayService.todayHolidays.subscribe({
        next: (holidays: PublicHoliday[]) => {
          if (holidays) {
            this.holidays = filterDepartmentsForHolidays({
              holidays,
              place: this?.place,
              location: this?.search?.location,
            });
          }
        },
        error: (error) => {
          console.error("Cannot load transports", error);
        },
      })
    );
  }
}
