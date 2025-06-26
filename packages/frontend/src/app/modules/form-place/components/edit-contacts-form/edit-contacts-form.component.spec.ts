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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";

import { EditContactsFormComponent } from "./edit-contacts-form.component";
import { AdminPlaceService } from "../../services/admin-place.service";
import { AdminPlaceContactsService } from "../../services/admin-place-contacts.service";

import { AdminPlaceComponent } from "../../../admin-place/components/admin-place/admin-place.component";

import { SharedModule } from "../../../shared/shared.module";

import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes";
import { THEME_CONFIGURATION } from "../../../../models";
import {
  PLACE_CONTACT_FOR_ADMIN_MOCK,
  ONLINE_PLACE_MOCK,
  MockAuthService,
} from "../../../../../../mocks";

describe("EditContactsFormComponent", () => {
  let component: EditContactsFormComponent;
  let fixture: ComponentFixture<EditContactsFormComponent>;
  let adminPlaceService: AdminPlaceService;
  let placeContactsService: AdminPlaceContactsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/manage-place/14270`,
            component: AdminPlaceComponent,
          },
        ]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: "1" } },
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      declarations: [EditContactsFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactsFormComponent);

    adminPlaceService = TestBed.inject(AdminPlaceService);
    placeContactsService = TestBed.inject(AdminPlaceContactsService);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;

    component.place = new Place(ONLINE_PLACE_MOCK);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("doit s'initialiser correctement", () => {
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(new Place(ONLINE_PLACE_MOCK)));
    jest
      .spyOn(placeContactsService, "getPlaceContactsForAdmin")
      .mockReturnValue(of([PLACE_CONTACT_FOR_ADMIN_MOCK]));

    component.ngOnInit();
    expect(component.place).toMatchObject(new Place(ONLINE_PLACE_MOCK));
    expect(component.placeContacts).toStrictEqual([
      PLACE_CONTACT_FOR_ADMIN_MOCK,
    ]);
    expect(component.contactsBeforeUpdate).toStrictEqual([
      PLACE_CONTACT_FOR_ADMIN_MOCK,
    ]);
  });

  it("doit initialiser le formulaire correctement lorsqu'on l'ouvre", () => {
    component.openEditContact(PLACE_CONTACT_FOR_ADMIN_MOCK);

    expect(component.contactToEdit).toBeNull();

    component.cguChecked = true;
    component.openEditContact(PLACE_CONTACT_FOR_ADMIN_MOCK);

    expect(component.contactToEdit).toBe(PLACE_CONTACT_FOR_ADMIN_MOCK);
    expect(component.f.lastname.value).toBe(
      PLACE_CONTACT_FOR_ADMIN_MOCK.lastname
    );
    expect(component.f.name.value).toBe(PLACE_CONTACT_FOR_ADMIN_MOCK.name);
    expect(component.f.phone.value).toBe(PLACE_CONTACT_FOR_ADMIN_MOCK.phone);
    expect(component.f.title.value).toBe(PLACE_CONTACT_FOR_ADMIN_MOCK.title);
  });

  it("doit mettre à jour les contacts quand indiqués", () => {
    component.cguChecked = true;
    component.openEditContact(PLACE_CONTACT_FOR_ADMIN_MOCK);

    jest
      .spyOn(placeContactsService, "updatePlaceContact")
      .mockReturnValue(of({ message: "CONTACT_PATCHED" }));

    component.patchPlaceContact();

    expect(component.contactToEdit).toBeNull();
  });

  it("doit changer de route quand on patch les contacts", () => {
    const routerNavigateSpy = jest.spyOn(router, "navigate");

    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(new Place(ONLINE_PLACE_MOCK)));
    jest
      .spyOn(placeContactsService, "getPlaceContactsForAdmin")
      .mockReturnValue(of([PLACE_CONTACT_FOR_ADMIN_MOCK]));

    component.ngOnInit();

    jest
      .spyOn(adminPlaceService, "patchPlaceContacts")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));

    component.patchContacts();

    expect(routerNavigateSpy).toHaveBeenCalledWith([
      `/${THEME_CONFIGURATION.defaultLanguage}/manage-place/${component.place.lieu_id}`,
    ]);
  });
});
