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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { SelectCategoryComponent } from "./select-category.component";
import { CategoryTranslateKeyPipe } from "../../pipes";
import {
  Categories,
  initializeCategoriesByTheme,
  Themes,
} from "@soliguide/common";

beforeAll(() => {
  initializeCategoriesByTheme(Themes.SOLIGUIDE_FR);
});

describe("SelectCategoryComponent", () => {
  let component: SelectCategoryComponent;
  let fixture: ComponentFixture<SelectCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCategoryComponent, CategoryTranslateKeyPipe],
      imports: [TranslateModule.forRoot({})],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryComponent);
    component = fixture.componentInstance;
    component.categories = [];
    jest
      .spyOn(component.selectedCategories, "emit")
      .mockImplementation(
        (categories) => (component.categories = categories ?? [])
      );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("update categories", () => {
    it("should update correcly with a service", () => {
      expect(component.categories).toStrictEqual([]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([Categories.LEGAL_ADVICE]);
      component.selectCategory(Categories.ADDICTION);
      expect(component.categories).toStrictEqual([
        Categories.ADDICTION,
        Categories.LEGAL_ADVICE,
      ]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([Categories.ADDICTION]);
    });

    it("should update correctly with a category", () => {
      expect(component.categories).toStrictEqual([]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([Categories.LEGAL_ADVICE]);
      component.selectCategory(Categories.SPORT_ACTIVITIES);
      expect(component.categories).toStrictEqual([
        Categories.LEGAL_ADVICE,
        Categories.SPORT_ACTIVITIES,
      ]);
      component.selectCategory(Categories.ACTIVITIES);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
      ]);
      component.selectCategory(Categories.HEALTH);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.HEALTH,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
        Categories.ADDICTION,
        Categories.STD_TESTING,
        Categories.PSYCHOLOGICAL_SUPPORT,
        Categories.CHILD_CARE,
        Categories.GENERAL_PRACTITIONER,
        Categories.DENTAL_CARE,
        Categories.PREGNANCY_CARE,
        Categories.VACCINATION,
        Categories.INFIRMARY,
        Categories.VET_CARE,
        Categories.ALLERGOLOGY,
        Categories.CARDIOLOGY,
        Categories.DERMATOLOGY,
        Categories.ECHOGRAPHY,
        Categories.ENDOCRINOLOGY,
        Categories.GASTROENTEROLOGY,
        Categories.GYNECOLOGY,
        Categories.KINESITHERAPY,
        Categories.MAMMOGRAPHY,
        Categories.OPHTHALMOLOGY,
        Categories.OTORHINOLARYNGOLOGY,
        Categories.NUTRITION,
        Categories.PEDICURE,
        Categories.PHLEBOLOGY,
        Categories.PNEUMOLOGY,
        Categories.RADIOLOGY,
        Categories.RHEUMATOLOGY,
        Categories.UROLOGY,
        Categories.SPEECH_THERAPY,
        Categories.STOMATOLOGY,
        Categories.OSTEOPATHY,
        Categories.ACUPUNCTURE,
      ]);
      component.selectCategory(Categories.HEALTH);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
      ]);
    });
  });
});
