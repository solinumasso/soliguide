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
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-helper-notification",
  templateUrl: "./helper-notification.component.html",
  styleUrls: ["./helper-notification.component.css"],
})
export class HelperNotificationComponent {
  @Input() public title!: string;
  @Input() public message!: string;
  @Input() public link!: (string | number)[];
  @Input() public buttonMessage!: string;
  @Input() public type!: string;

  @Output() public readonly clickFunction = new EventEmitter<void>();
}
