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
import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { differenceInMonths } from "date-fns";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[appLastLoginBadge]",
})
export class LastLoginBadgeDirective implements OnInit {
  @Input() lastLogin: Date | null;

  constructor(
    private el: ElementRef,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    const badgeClass = this.getBadgeClass();
    const displayText = this.getDisplayText();

    this.el.nativeElement.className = `status ${badgeClass}`;
    this.el.nativeElement.textContent = displayText;
  }

  private getBadgeClass(): string {
    if (!this.lastLogin) {
      return "status-danger";
    }

    const monthsDiff = differenceInMonths(
      new Date(),
      new Date(this.lastLogin),
    );
    return monthsDiff > 3 ? "status-danger" : "status-success";
  }

  private getDisplayText(): string {
    if (!this.lastLogin) {
      return this.translateService.instant("NEVER_CONNECTED");
    }

    const datePipe = new DatePipe(this.translateService.currentLang ?? "fr");
    return datePipe.transform(this.lastLogin, "short") ?? "";
  }
}
