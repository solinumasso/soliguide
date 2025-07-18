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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageMultipleSelectComponent } from "./manage-multiple-select.component";
import { CAMPAIGN_LIST } from "@soliguide/common";
import { CAMPAIGN_NAME_LABELS } from "../../../../models";
import { TranslateModule } from "@ngx-translate/core";

describe("ManageMultipleSelectComponent", () => {
  let component: ManageMultipleSelectComponent;
  let fixture: ComponentFixture<ManageMultipleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMultipleSelectComponent],
      imports: [TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMultipleSelectComponent);
    component = fixture.componentInstance;
    component.allOptionsLabel = "Toutes les campagnes";
    component.anyOptionLabel = "Aucune campagne";
    component.options = Object.keys(CAMPAIGN_LIST);
    component.optionLabels = CAMPAIGN_NAME_LABELS;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
