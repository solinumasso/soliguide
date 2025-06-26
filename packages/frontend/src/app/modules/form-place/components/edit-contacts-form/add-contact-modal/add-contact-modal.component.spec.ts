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
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { of } from "rxjs";

import { AddContactModalComponent } from "./add-contact-modal.component";
import { SharedModule } from "../../../../shared/shared.module";

import { Organisation } from "../../../../admin-organisation/interfaces";
import { InviteUserService } from "../../../../admin-organisation/services/invite-user.service";
import { OrganisationService } from "../../../../admin-organisation/services/organisation.service";

import { AuthService } from "../../../../users/services/auth.service";

import {
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
  USER_PRO_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";
import { User } from "../../../../users/classes";

const ORGANIZATION_COPY_MOCK = new Organisation(
  JSON.parse(JSON.stringify(ORGANIZATION_MOCK))
);

ORGANIZATION_COPY_MOCK._id = "Foo";
ORGANIZATION_COPY_MOCK.name = "Bar";
ORGANIZATION_COPY_MOCK.organization_id = 16;

describe("AddContactModalComponent", () => {
  let component: AddContactModalComponent;
  let fixture: ComponentFixture<AddContactModalComponent>;

  let modalService: NgbModal;
  let authService: AuthService;
  let inviteUserService: InviteUserService;
  let organisationService: OrganisationService;
  let toastr: ToastrService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddContactModalComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactModalComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.me = USER_SOLIGUIDE_MOCK;

    authService = TestBed.inject(AuthService);
    inviteUserService = TestBed.inject(InviteUserService);
    modalService = TestBed.inject(NgbModal);
    organisationService = TestBed.inject(OrganisationService);
    toastr = TestBed.inject(ToastrService);
    jest
      .spyOn(authService, "currentUserValue", "get")
      .mockReturnValue(new User(USER_PRO_MOCK));
    jest
      .spyOn(organisationService, "get")
      .mockReturnValue(of(ORGANIZATION_MOCK));
    jest.spyOn(organisationService, "searchOrga").mockReturnValue(
      of({
        nbResults: 2,
        results: [ORGANIZATION_MOCK, ORGANIZATION_COPY_MOCK],
      })
    );
    fixture.detectChanges();
  });

  it("Doit créer le composant", () => {
    expect(component).toBeTruthy();
  });

  it("Doit envoyer une invitation", () => {
    jest
      .spyOn(inviteUserService, "sendInvite")
      .mockReturnValue(of({ message: "Invitation envoyée " }));
    jest.spyOn(toastr, "success");
    jest.spyOn(modalService, "dismissAll");
    component.f.lastname.setValue("Nom invité");
    component.f.mail.setValue("invite@structure-social.fr");
    component.f.name.setValue("Prénom invité");
    component.sendInvite();
    expect(toastr.success).toHaveBeenCalledWith("INVITATION_HAS_BEEN_SENT");
    expect(modalService.dismissAll).toHaveBeenCalled();
  });
});
