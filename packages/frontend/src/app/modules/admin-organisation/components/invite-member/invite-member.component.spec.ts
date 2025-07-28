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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../../shared/shared.module";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { InviteMemberComponent } from "./invite-member.component";

import { InviteUserService } from "../../services/invite-user.service";
import { OrganisationService } from "../../services/organisation.service";

import {
  CommonPosthogMockService,
  ORGANIZATION_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from "../../../../shared/modules/FixNavigationTriggeredOutsideAngularZoneNgModule.module";

describe("InviteMemberComponent", () => {
  let component: InviteMemberComponent;
  let fixture: ComponentFixture<InviteMemberComponent>;
  let organisationService: OrganisationService;
  let inviteUserService: InviteUserService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InviteMemberComponent],
      imports: [
        BrowserAnimationsModule,
        FixNavigationTriggeredOutsideAngularZoneNgModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/organisations/${ORGANIZATION_MOCK.organization_id}`,
            redirectTo: "",
          },
        ]),
        SharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: "5fb648823cb90874d9ab1bef" },
            },
            params: of({
              id: "5fb648823cb90874d9ab1bef",
            }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMemberComponent);
    organisationService = TestBed.inject(OrganisationService);
    inviteUserService = TestBed.inject(InviteUserService);
    router = TestBed.inject(Router);
    jest
      .spyOn(organisationService, "get")
      .mockReturnValue(of(ORGANIZATION_MOCK));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should invite a new user to the organization", () => {
    jest
      .spyOn(inviteUserService, "sendInvite")
      .mockReturnValue(of({ message: "Invitation bien envoyée" }));
    jest.spyOn(router, "navigate");

    component.f.mail.setValue("test@test.test");
    component.f.lastname.setValue("test lastname");
    component.f.name.setValue("test name");

    component.sendInvite();

    expect(component.loading).toBe(false);
    expect(router.navigate).toHaveBeenCalled();
  });
});
