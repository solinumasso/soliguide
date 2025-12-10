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
import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";

import { FormChooseCategoryFicheComponent } from "./choose-category.component";
import { CategoryTranslateKeyPipe } from "../../../../../shared/pipes";

import { SERVICE_MOCK } from "../../../../../../../../mocks/SERVICE.mock";
import {
  AvailableEquipmentType,
  DietaryRegimesType,
  VoucherType,
} from "@soliguide/common";

describe("FormChooseCategoryFicheComponent", () => {
  let component: FormChooseCategoryFicheComponent;
  let fixture: ComponentFixture<FormChooseCategoryFicheComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormChooseCategoryFicheComponent,
        CategoryTranslateKeyPipe,
      ],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChooseCategoryFicheComponent);
    component = fixture.componentInstance;
    component.service = SERVICE_MOCK;
    component.serviceIndex = 0;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return a subarray with numer between 1 and 3", () => {
    expect(component.generateSortedArray(1, 4)).toEqual([1, 2, 3, 4]);
  });

  describe("displayTextareaForm", () => {
    it("should be return true", () => {
      expect(component.displayTextareaForm("jobsList")).toBe(true);

      component.service.categorySpecificFields = {
        availableEquipmentType: [AvailableEquipmentType.OTHER],
      };

      expect(
        component.displayTextareaForm("availableEquipmentPrecisions")
      ).toBe(true);

      component.service.categorySpecificFields = {
        voucherType: VoucherType.OTHER,
      };

      expect(component.displayTextareaForm("voucherTypePrecisions")).toBe(true);
    });

    it("should be return false", () => {
      expect(component.displayTextareaForm("canteensMealType")).toBe(false);

      expect(
        component.displayTextareaForm("availableEquipmentPrecisions")
      ).toBe(false);

      component.service.categorySpecificFields = {
        voucherType: VoucherType.FOOD_CHEQUE,
      };

      expect(component.displayTextareaForm("voucherTypePrecisions")).toBe(
        false
      );
    });
  });

  describe("displayChecklistForm", () => {
    it("should be return true", () => {
      expect(component.displayChecklistForm("availableEquipmentType")).toBe(
        true
      );

      component.service.categorySpecificFields = {
        dietaryRegimesType: DietaryRegimesType.WE_ADAPT,
      };

      expect(component.displayChecklistForm("dietaryAdaptationsType")).toBe(
        true
      );
    });

    it("should be return false", () => {
      expect(component.displayChecklistForm("canteensMealType")).toBe(false);

      component.service.categorySpecificFields = {
        dietaryRegimesType: DietaryRegimesType.DO_NOT_KNOW,
      };

      expect(component.displayChecklistForm("dietaryAdaptationsType")).toBe(
        false
      );
    });
  });
});
