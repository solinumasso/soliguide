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
import { CommonModule } from "@angular/common";
import { SharedModule } from "./../../../shared/shared.module";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { DisplayPublicAdminComponent } from "./display-public-admin.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";

describe("DisplayPublicAdminComponent", () => {
  let component: DisplayPublicAdminComponent;
  let fixture: ComponentFixture<DisplayPublicAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPublicAdminComponent],
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPublicAdminComponent);
    component = fixture.componentInstance;
    component.publics = ONLINE_PLACE_MOCK.publics;
    component.languages = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
