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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ModalitiesToggleComponent } from "./modalities-toggle.component";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ModalitiesToggleComponent", () => {
  let component: ModalitiesToggleComponent;
  let fixture: ComponentFixture<ModalitiesToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalitiesToggleComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalitiesToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should toggle switch and emit event when buttons are clicked", () => {
    component.toggleSwitch(false);

    expect(component.checked).toBe(false);

    component.toggleSwitch(true);

    expect(component.checked).toBe(true);
  });

  it("should have initial state set", () => {
    expect(component.checked).toBeUndefined();
  });
});
