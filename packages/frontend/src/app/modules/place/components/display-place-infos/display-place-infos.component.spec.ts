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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";

import { Place } from "../../../../models/place/classes";

import { DisplayPlaceInfosComponent } from "./display-place-infos.component";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayPlaceInfosComponent", () => {
  let component: DisplayPlaceInfosComponent;
  let fixture: ComponentFixture<DisplayPlaceInfosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPlaceInfosComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPlaceInfosComponent);
    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
