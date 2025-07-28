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
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { AdminOrganisationComponent } from "./admin-organisation.component";

import { OrganisationService } from "../../services/organisation.service";

import { Place } from "../../../../models/place/classes";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { SharedModule } from "../../../shared/shared.module";

import {
  CommonPosthogMockService,
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
  USER_PRO_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { TranslateModule } from "@ngx-translate/core";
import { PlaceForOrganization } from "../../types";
import { PosthogService } from "../../../analytics/services/posthog.service";

ONLINE_PLACE_MOCK.name = "Centre social";

const ONLINE_PLACE_COPY_MOCK = new Place(
  JSON.parse(JSON.stringify(ONLINE_PLACE_MOCK))
);

ONLINE_PLACE_COPY_MOCK._id = ONLINE_PLACE_MOCK._id + "_copy";
ONLINE_PLACE_COPY_MOCK.name = "Accueil de jour";

const USER_PRO_COPY_MOCK = new User(
  JSON.parse(JSON.stringify({ ...USER_PRO_MOCK, name: "Bastien" }))
);
USER_PRO_COPY_MOCK._id = USER_PRO_MOCK._id + "_copy";
USER_PRO_COPY_MOCK.name = "Amandine";

ORGANIZATION_MOCK.places = [ONLINE_PLACE_MOCK, ONLINE_PLACE_COPY_MOCK];

describe("AdminOrganisationComponent", () => {
  let component: AdminOrganisationComponent;
  let fixture: ComponentFixture<AdminOrganisationComponent>;
  let organisationService: OrganisationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrganisationComponent],
      imports: [
        HttpClientTestingModule,
        NgbModule,
        SharedModule,
        RouterModule.forRoot([]),
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
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganisationComponent);
    organisationService = TestBed.inject(OrganisationService);
    jest
      .spyOn(organisationService, "get")
      .mockReturnValue(of(ORGANIZATION_MOCK));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("doit créer le composant", () => {
    expect(component).toBeTruthy();
  });

  describe("la détection de si l'utilisateur peut accéder à l'organisation ou pas", () => {
    it("l'utilisateur doit accéder à l'orga, car il a un rôle OWNER dessus", () => {
      expect(component.organisation._id).toBe(ORGANIZATION_MOCK._id);
    });
  });

  it("doit trier les places de l'orga dans l'ordre alphabétique", () => {
    component.sortPlaces("name");
    expect(
      component.organisation.places.map(
        (place: PlaceForOrganization) => place.name
      )
    ).toStrictEqual(["Accueil de jour", "Centre social"]);
  });
});
