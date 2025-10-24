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
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { AddPlaceToOrgaComponent } from "./add-place-to-orga.component";
import { OrganisationService } from "../../services/organisation.service";
import { ManagePlacesService } from "../../../admin-place/services/manage-places.service";
import {
  CommonPosthogMockService,
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { Place } from "../../../../models";
import { SearchResults } from "@soliguide/common";

const searchResult: SearchResults<Place> = {
  nbResults: 1,
  results: [ONLINE_PLACE_MOCK],
};

describe("AddPlaceToOrgaComponent", () => {
  let component: AddPlaceToOrgaComponent;
  let fixture: ComponentFixture<AddPlaceToOrgaComponent>;
  let organisationService: OrganisationService;
  let managePlacesService: ManagePlacesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlaceToOrgaComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: "5fb648823cb90874d9ab1bef",
              },
            },
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaceToOrgaComponent);
    organisationService = TestBed.inject(OrganisationService);
    jest
      .spyOn(organisationService, "get")
      .mockReturnValue(of(ORGANIZATION_MOCK));
    managePlacesService = TestBed.inject(ManagePlacesService);
    jest
      .spyOn(managePlacesService, "launchSearch")
      .mockReturnValue(of(searchResult));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the same placeObjectIds as ORGANIZATION_MOCK", () => {
    expect(component.orgaPlaces).toEqual(
      ORGANIZATION_MOCK.places.map((orga) => orga._id)
    );
  });

  it("should return ONLINE_PLACE_MOCK for both search methods", () => {
    component.searchPlacebyName("test");
    expect(component.foundPlaces).toEqual([ONLINE_PLACE_MOCK]);

    component.searchPlacebyId("14270");
    expect(component.foundPlaces).toEqual([ONLINE_PLACE_MOCK]);
  });
});
