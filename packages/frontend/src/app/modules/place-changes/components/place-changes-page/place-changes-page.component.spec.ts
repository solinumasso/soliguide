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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { PlaceChangesPageComponent } from "./place-changes-page.component";

import { PlaceChangesService } from "../../services/place-changes.service";

import { AuthService } from "../../../users/services/auth.service";

import { PLACE_CHANGES_MOCK } from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { TranslateModule } from "@ngx-translate/core";

describe("PlaceChangesPageComponent", () => {
  let component: PlaceChangesPageComponent;
  let fixture: ComponentFixture<PlaceChangesPageComponent>;
  let placeChangesService: PlaceChangesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceChangesPageComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: "5fb61d3a3cb90874d9ab12e2",
            }),
          },
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceChangesPageComponent);
    placeChangesService = TestBed.inject(PlaceChangesService);
    jest
      .spyOn(placeChangesService, "getVersion")
      .mockReturnValue(of(PLACE_CHANGES_MOCK));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
