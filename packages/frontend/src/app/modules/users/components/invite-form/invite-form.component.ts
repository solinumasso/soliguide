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
import { PlaceForOrganization } from "../../../admin-organisation/types";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl, UntypedFormGroup } from "@angular/forms";

import { ToastrService } from "ngx-toastr";

import { Organisation } from "../../../admin-organisation/interfaces";
import { UserRole } from "@soliguide/common";

import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-invite-form",
  templateUrl: "./invite-form.component.html",
  styleUrls: ["./invite-form.component.css"],
})
export class InviteFormComponent {
  @Input() public inviteForm!: UntypedFormGroup;
  @Input() public organisation: Organisation;
  @Input() public places: string[];
  @Input() public role: UserRole;
  @Input() public submitted: boolean;

  @Output() public readonly placesChange = new EventEmitter<string[]>();

  public allPlaces = true;
  public readonly UserRole = UserRole;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService
  ) {
    this.organisation = new Organisation();
    this.places = [];
    this.role = UserRole.OWNER;
    this.submitted = false;
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.inviteForm.controls;
  }

  public checkCheckBoxvalue = (event: Event): void => {
    const checked = (event.target as HTMLInputElement).checked as boolean;
    this.allPlaces = checked;
    this.places = this.allPlaces
      ? this.organisation.places.map((place: PlaceForOrganization) => place._id)
      : [];
    this.placesChange.emit(this.places);
  };

  public checkRoleValue = (event: Event): void => {
    const value = (event.target as HTMLInputElement).value as UserRole;
    if (value === UserRole.OWNER || value === UserRole.READER) {
      this.allPlaces = true;
      this.places = this.organisation.places.map(
        (place: PlaceForOrganization) => place._id
      );
    }
    this.placesChange.emit(this.places);
  };

  public addToPlace = (id: string): void => {
    if (this.places.includes(id)) {
      this.places = this.places.filter((e) => e !== id);
    } else {
      this.places.push(id);
    }

    this.placesChange.emit(this.places);

    if (this.places.length < 1) {
      this.toastr.error(
        this.translateService.instant("EDITOR_MUST_BE_ALLOWED_TO_EDIT")
      );
      return;
    }
  };
}
