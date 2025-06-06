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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { BasePlaceTempInfo } from "@soliguide/common";
import { endDateAfterBeginDateValidator } from "../../../../../shared/validators";

import { FormStartAndEndDateFicheComponent } from "./start-and-end-date.component";
import { TranslateModule } from "@ngx-translate/core";

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);

const reactiveObject = new FormGroup(
  {
    dateDebut: new FormControl(today),
    dateFin: new FormControl(null),
  },
  endDateAfterBeginDateValidator({
    beginDateControlName: "dateDebut",
    endDateControlName: "dateFin",
  })
);

describe("FormStartAndEndDateFicheComponent", () => {
  let component: FormStartAndEndDateFicheComponent;
  let fixture: ComponentFixture<FormStartAndEndDateFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormStartAndEndDateFicheComponent],
      imports: [
        ToastrModule.forRoot({}),
        NgbModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStartAndEndDateFicheComponent);
    component = fixture.componentInstance;
    component.object = new BasePlaceTempInfo({
      dateDebut: today,
      dateFin: null,
    });
    component.parentFormGroup = reactiveObject;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Reactive Form", () => {
    it("should set today for the starting date", () => {
      component.getToday("dateDebut");
      expect(component.parentFormGroup.controls.dateDebut.value.getDate()).toBe(
        today.getDate()
      );
    });

    it("should set today for the ending date", () => {
      component.getToday("dateFin");
      expect(component.parentFormGroup.controls.dateFin.value.getDate()).toBe(
        today.getDate()
      );
    });
  });
  describe("NgModel Form", () => {
    it("should set today for the starting date", () => {
      component.getToday("dateDebut");
      expect(component.object.dateDebut?.getDate()).toBe(today.getDate());
    });

    it("should set today for the ending date", () => {
      component.getToday("dateFin");
      expect(component.object.dateFin?.getDate()).toBe(today.getDate());
    });
  });
});
