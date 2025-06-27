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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";

import { DisplayPlaceChangesComponent } from "./display-place-changes.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { PlaceChangesSection } from "@soliguide/common";
import { TranslateModule } from "@ngx-translate/core";
import { Place } from "../../../../models";

describe("DisplayPlaceChangesComponent", () => {
  let component: DisplayPlaceChangesComponent;
  let fixture: ComponentFixture<DisplayPlaceChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPlaceChangesComponent],
      imports: [
        NgbModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPlaceChangesComponent);
    component = fixture.componentInstance;

    component.oldPlace = { ...ONLINE_PLACE_MOCK, services_all: [] };
    component.placeChanged = { ...ONLINE_PLACE_MOCK, services_all: [] };
    component.section = PlaceChangesSection.services;
    component.changeSection = "new";

    const oldPlace = {
      services_all: [
        { serviceObjectId: 1, name: "Service 1" },
        { serviceObjectId: 2, name: "Service 2" },
      ],
    } as unknown as Place;
    const newPlace = {
      services_all: [
        { serviceObjectId: 2, name: "Updated Service 2" },
        { serviceObjectId: 3, name: "New Service 3" },
      ],
    } as unknown as Place;

    component.placeChanged = newPlace;
    component.oldPlace = oldPlace;

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.added).toEqual([
      { serviceObjectId: 3, name: "New Service 3" },
    ]);
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.edited).toEqual([
      { serviceObjectId: 2, name: "Updated Service 2" },
    ]);
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.deleted).toEqual([
      { serviceObjectId: 1, name: "Service 1" },
    ]);

    expect(component.servicesChanges.unchanged).toEqual([]);
  });
});
