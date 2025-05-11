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
import { FormControl, FormGroup, Validators } from "@angular/forms";

import {
  MIN_DATE_GENERAL,
  getMinDateToday,
} from "../../../../../shared/constants";
import { BasePlaceTempInfos } from "@soliguide/common";
import { endDateAfterBeginDateValidator } from "../../../../../shared";

@Component({
  selector: "app-form-start-and-end-date-fiche",
  templateUrl: "./start-and-end-date.component.html",
  styleUrls: ["./start-and-end-date.component.css"],
})
export class FormStartAndEndDateFicheComponent implements OnInit {
  @Input() public object!: BasePlaceTempInfos;
  @Output() public readonly objectChange =
    new EventEmitter<BasePlaceTempInfos>();

  @Input() public parentFormGroup!: FormGroup;

  @Input() public endDateRequired = false;
  @Input() public hasEndDateMin = false;
  @Input() public submitted = false;

  public dateDebut: string | null;
  public dateFin: string | null;

  public readonly MIN_DATE_TODAY = getMinDateToday();
  public readonly MIN_DATE_GENERAL = MIN_DATE_GENERAL;
  public readonly form: FormGroup;

  constructor() {
    this.dateDebut = null;
    this.dateFin = null;
    this.form = new FormGroup(
      {
        dateDebut: new FormControl(this.object?.dateDebut, [
          Validators.required,
        ]),
        dateFin: new FormControl(this.object?.dateFin),
      },
      {
        validators: [
          endDateAfterBeginDateValidator({
            beginDateControlName: "dateDebut",
            endDateControlName: "dateFin",
          }),
        ],
      }
    );
  }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }

  public refreshDates(dateDebut: Date | null, dateFin: Date | null): void {
    this.dateDebut = dateDebut ? this.formatDate(dateDebut) : null;
    this.dateFin = dateFin ? this.formatDate(dateFin) : null;
  }

  public ngOnInit(): void {
    if (!this.object) {
      this.object = new BasePlaceTempInfos();
    }
    if (this.object) {
      this.refreshDates(this.object.dateDebut, this.object.dateFin);
    }

    if (this.parentFormGroup) {
      this.refreshDates(
        this.parentFormGroup.get("dateDebut")?.value,
        this.parentFormGroup.get("dateFin")?.value
      );
    } else {
      this.parentFormGroup = new FormGroup(
        {
          dateDebut: new FormControl(this.object.dateDebut, [
            Validators.required,
          ]),
          dateFin: new FormControl(this.object.dateFin),
        },
        {
          validators: [
            endDateAfterBeginDateValidator({
              beginDateControlName: "dateDebut",
              endDateControlName: "dateFin",
            }),
          ],
        }
      );
    }
    this.refreshParentObject();
  }

  public setDateFin(date: Date): void {
    this.parentFormGroup.controls.dateFin.setValue(date);
    this.object.dateFin = date;
    this.refreshParentObject();
  }

  public setDateDebut(dateDebut: Date): void {
    this.parentFormGroup.controls.dateDebut.setValue(dateDebut);
    this.object.dateDebut = dateDebut;
    this.refreshParentObject();
  }

  public refreshParentObject() {
    if (this.objectChange) {
      this.objectChange.emit(this.object);
    }
  }

  public getToday(date: "dateFin" | "dateDebut"): void {
    const today = new Date();
    const formattedToday = this.formatDate(today);

    if (date === "dateDebut") {
      this.setDateDebut(today);
      this.dateDebut = formattedToday;
    } else if (date === "dateFin") {
      this.setDateFin(today);
      this.dateFin = formattedToday;
    }
  }
}
