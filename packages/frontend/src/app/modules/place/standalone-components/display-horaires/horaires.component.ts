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
import { OpeningHours } from "../../../../models";
import { DayName, WEEK_DAYS } from "@soliguide/common";
import { weekDaysOrdering } from "../../../../shared/functions";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, TranslatePipe, NgbTooltip],
  selector: "app-display-horaires",
  styleUrls: ["./horaires.component.css"],
  templateUrl: "./horaires.component.html",
})
export class DisplayHorairesComponent implements OnInit {
  @Input() public hours!: OpeningHours | null;
  @Input() public displayClosedDays!: boolean;
  @Input() public isPlace!: boolean;
  @Input() public daysMustBeOrdered?: boolean;
  @Input() public isTempClosed: boolean;
  @Input() public isPartiallyOpen: boolean;

  public weekDays: DayName[];
  public indexToday: number;
  public dayToday: DayName;

  public constructor() {
    this.isPlace = true;
  }

  ngOnInit(): void {
    this.indexToday = (new Date().getDay() + 6) % 7;
    this.dayToday = WEEK_DAYS[this.indexToday];
    if (this.daysMustBeOrdered) {
      this.weekDays = weekDaysOrdering(WEEK_DAYS, this.indexToday);
    } else {
      this.weekDays = WEEK_DAYS;
    }
  }
}
