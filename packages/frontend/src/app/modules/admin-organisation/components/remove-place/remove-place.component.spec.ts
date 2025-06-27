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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import {
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
  USER_PRO_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";
import { ToastrModule } from "ngx-toastr";
import { Place } from "../../../../models/place/classes";
import { Organisation } from "../../interfaces/organisation.interface";

import { RemovePlaceComponent } from "./remove-place.component";
import { AuthService } from "../../../users/services/auth.service";
import { TranslateModule } from "@ngx-translate/core";
import { User } from "../../../users/classes";

describe("RemovePlaceComponent", () => {
  let component: RemovePlaceComponent;
  let fixture: ComponentFixture<RemovePlaceComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemovePlaceComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePlaceComponent);
    authService = TestBed.inject(AuthService);
    authService.currentUserSubject.next(new User(USER_PRO_MOCK));

    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    component.orga = new Organisation(ORGANIZATION_MOCK);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Comportement si proviens de la page admin-orga ou admin-place", () => {
    it("doit avoir la bonne redirection si on vient de l'admin-place", () => {
      component.fromPlace = true;

      component.ngOnInit();

      expect(component.user).toMatchObject(new User(USER_PRO_MOCK));
      expect(component.redirection).toStrictEqual([
        "/fr",
        "organisations",
        `${new User(USER_PRO_MOCK)?.currentOrga?.organization_id}`,
      ]);

      authService.currentUserSubject.next(USER_SOLIGUIDE_MOCK);

      component.ngOnInit();
      expect(component.user).toMatchObject(USER_SOLIGUIDE_MOCK);
      expect(component.redirection).toStrictEqual([
        "/fr",
        "manage-place",
        "search",
      ]);
    });

    it("doit avoir la bonne redirection si on vient de l'admin-orga", () => {
      component.fromPlace = false;

      component.ngOnInit();
      expect(component.user).toBeNull();
      expect(component.redirection).toStrictEqual([]);

      authService.currentUserSubject.next(new User(USER_PRO_MOCK));

      component.ngOnInit();
      expect(component.user).toBeNull();
      expect(component.redirection).toStrictEqual([]);
    });
  });
});
