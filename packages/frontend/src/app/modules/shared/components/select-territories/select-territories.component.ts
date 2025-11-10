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
import { AbstractControl } from "@angular/forms";

import { TranslateService } from "@ngx-translate/core";
import {
  AnyDepartmentCode,
  DEPARTMENTS_MAP,
  SoliguideCountries,
  DepartmentInfoContent,
} from "@soliguide/common";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { THEME_CONFIGURATION } from "../../../../models";

import Fuse from "fuse.js";

import { Subscription, forkJoin } from "rxjs";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { filterDepartments } from "../../../../shared";

@Component({
  selector: "app-select-territories",
  templateUrl: "./select-territories.component.html",
  styleUrls: ["./select-territories.component.css"],
})
export class SelectTerritoriesComponent implements OnInit {
  @Input() public isRequired!: boolean;
  @Input({ required: true }) public label!: string;
  @Input() public submitted!: boolean;
  @Input() public territories!: string[];
  @Input() public territoriesFormControl!: AbstractControl;
  @Input() public disabled: boolean;

  @Output() public readonly selectedTerritories = new EventEmitter<string[]>();

  public filter: string;
  public localTerritories: AnyDepartmentCode[];
  public me!: User | null;

  public haveBeenTouched = false;

  public stringToDisplay: string;
  public country: SoliguideCountries;

  public allDepartements: DepartmentInfoContent<SoliguideCountries>[] = [];
  public departments: DepartmentInfoContent<SoliguideCountries>[] = [];

  public fuse = new Fuse([]);
  public fuseKey: "departmentCode" | "departmentName" = "departmentName";

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.country = THEME_CONFIGURATION.country;
    this.filter = "";

    this.localTerritories = [];
    this.disabled = false;
    this.departments = [];
  }

  public ngOnInit(): void {
    this.localTerritories = this.territoriesFormControl
      ? this.territoriesFormControl.value
      : this.territories;
    this.me = this.authService.currentUserValue;

    this.allDepartements = this.sortDepartments(filterDepartments(this.me));

    this.departments = [...this.allDepartements];

    this.fuse = new Fuse(this.allDepartements, {
      keys: ["departmentName", "departmentCode"],
      threshold: 0.2,
    });

    this.filterDepartements();
    this.getStringToDisplay();

    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.filterDepartements();
        this.getStringToDisplay();
      })
    );
  }

  public updateTerritories() {
    this.territoriesFormControl
      ? this.territoriesFormControl.setValue(this.localTerritories)
      : this.selectedTerritories.emit(this.localTerritories);
  }

  public filterDepartements(): void {
    const departments = this.filter
      ? this.fuse.search(this.filter).map((result) => result.item)
      : this.allDepartements;

    this.departments = this.sortDepartments(departments);
  }

  private sortDepartments(
    departments: DepartmentInfoContent<SoliguideCountries>[]
  ) {
    return departments.sort((a, b) =>
      a.departmentCode.localeCompare(b.departmentCode)
    );
  }

  public getStringToDisplay(): void {
    forkJoin({
      none: this.translateService.get("NONE"),
      allDepartments: this.translateService.get("ALL_DEPARTMENTS"),
    }).subscribe((translations) => {
      if (this.localTerritories.length === this.allDepartements.length) {
        this.stringToDisplay = translations.allDepartments;
      } else if (this.localTerritories.length === 0) {
        this.stringToDisplay = translations.none;
      } else {
        this.stringToDisplay = this.localTerritories
          .map(
            (territory) =>
              DEPARTMENTS_MAP[this.country][territory].departmentName
          )
          .join(", ");
      }
    });
  }

  public selectAll(): void {
    this.localTerritories =
      this.localTerritories.length !== this.allDepartements.length
        ? this.allDepartements.map((dep) => dep.departmentCode)
        : [];

    this.updateTerritories();
    this.haveBeenTouched = true;
    this.getStringToDisplay();
  }

  public toggleCheckboxButton(key: AnyDepartmentCode): void {
    const index = this.localTerritories.indexOf(key);

    if (index !== -1) {
      this.localTerritories.splice(index, 1);
    } else {
      this.localTerritories.push(key);
    }
    this.updateTerritories();
    this.haveBeenTouched = true;
    this.getStringToDisplay();
  }
}
