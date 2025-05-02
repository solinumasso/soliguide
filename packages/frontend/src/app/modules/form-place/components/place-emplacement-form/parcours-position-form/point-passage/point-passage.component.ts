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
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { PlaceParcours } from "../../../../../../models/place/classes";

import { VALID_HOURS } from "../../../../../../shared";
import { CommonTimeslot, OpeningHoursContext } from "@soliguide/common";

@Component({
  selector: "app-form-point-passage",
  templateUrl: "./point-passage.component.html",
  styleUrls: [
    "./point-passage.component.css",
    "../../../services/single-service/single-service.component.css",
  ],
})
export class FormPointPassageComponent implements OnInit {
  @Input() public point: PlaceParcours;
  @Input() public pointIndex: number;
  @Input() public submitted: boolean;
  @Input() public placeId: number;
  @Input() public passageTimeslot: CommonTimeslot;

  public pointPassageForm: UntypedFormGroup;
  public timeslotDisplayed: string;

  @Output() public readonly deletedPointIndex = new EventEmitter<number>();
  @Output() public readonly hasError = new EventEmitter<boolean>();
  @Output() public readonly showPointIndex = new EventEmitter<number>();
  @Output() public readonly passageTimeslotChange =
    new EventEmitter<CommonTimeslot>();

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.initForm();

    this.timeslotDisplayed = this.passageTimeslot?.start.toString();
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.pointPassageForm.controls;
  }

  public get timeslot(): UntypedFormArray {
    return this.f.timeslot as UntypedFormArray;
  }

  public initForm = (): void => {
    this.pointPassageForm = this.formBuilder.group({
      description: [this.point.description, []],
      timeslot: this.formBuilder.array([]),
      position: [this.point.position, []],
    });
    this.initTimeslot();
  };

  public initTimeslot = (): void => {
    if (!this.passageTimeslot?.end || !this.passageTimeslot?.start) {
      this.passageTimeslot = new CommonTimeslot(
        {
          end: 1700,
          start: 800,
        },
        OpeningHoursContext.ADMIN
      );

      setTimeout(() => {
        this.passageTimeslotChange.emit(this.passageTimeslot);
      }, 100);
    }

    this.timeslot.push(
      this.formBuilder.group({
        end: [this.passageTimeslot.end ?? null, [Validators.required]],
        start: [this.passageTimeslot.start ?? null, [Validators.required]],
      })
    );
  };

  public setPassageHours = (event: string, key: "start" | "end"): void => {
    this.passageTimeslot[key] = VALID_HOURS.test(event) ? event : null;
    this.passageTimeslotChange.emit(new CommonTimeslot(this.passageTimeslot));

    if (key === "start") {
      this.timeslotDisplayed = this.passageTimeslot?.start.toString();
    }
  };

  public setDescription = (event: string): void => {
    this.point.description = event;
  };

  public toggleShow = (): void => {
    if (this.point.show) {
      this.point.show = false;
    } else {
      this.showPointIndex.emit(this.pointIndex);
    }
  };

  public deletePoint = (): void => {
    this.deletedPointIndex.emit(this.pointIndex);
  };

  public emitInvalidAddress = (event: Event): void => {
    const isInvalid = (event.target as HTMLInputElement)
      .value as unknown as boolean;

    this.f.position.setValue(isInvalid ? null : this.point.position);
    this.hasError.emit(isInvalid);
  };
}
