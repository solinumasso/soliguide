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
import { SharedModule } from "./../../../shared/shared.module";
import { ManageCommonModule } from "./../../../manage-common/manage-common.module";
import { RouterModule } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaceHistoryComponent } from "./place-history.component";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  ONLINE_PLACE_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";
import { Place } from "../../../../models";
import { SearchPlaceChanges } from "../../classes";

describe("PlaceHistoryComponent", () => {
  let component: PlaceHistoryComponent;
  let fixture: ComponentFixture<PlaceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgbAccordionModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
        ManageCommonModule,
        SharedModule,
        FormsModule,
      ],
      declarations: [PlaceHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceHistoryComponent);
    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    component.search = new SearchPlaceChanges(
      { userData: { status: null } },
      USER_SOLIGUIDE_MOCK
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
