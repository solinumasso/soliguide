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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { TranslateModule } from "@ngx-translate/core";

import { ListInvitationsComponent } from "./list-invitations.component";

import { InviteUserService } from "../../services/invite-user.service";

import { SharedModule } from "../../../shared/shared.module";

import {
  INVITATION_MOCK,
  ORGANIZATION_MOCK,
  CommonPosthogMockService,
} from "../../../../../../mocks";

import { PosthogService } from "../../../analytics/services/posthog.service";

describe("ListInvitationsComponent", () => {
  let component: ListInvitationsComponent;
  let fixture: ComponentFixture<ListInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListInvitationsComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .catch((e) => {
        throw e;
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvitationsComponent);
    component = fixture.componentInstance;
    component.organisation = ORGANIZATION_MOCK;

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("Suppression d'une invitation", () => {
    it("devrait supprimer une invitation", () => {
      const deleteInviteSpy = jest
        .spyOn(InviteUserService.prototype, "deleteInvitation")
        .mockReturnValue(of({ message: "OK" }));

      component.organisation.invitations = [INVITATION_MOCK];

      component.deleteInvitation(INVITATION_MOCK);

      expect(component.organisation.invitations.indexOf(INVITATION_MOCK)).toBe(
        -1
      );
      expect(deleteInviteSpy).toHaveBeenCalled();
    });
  });
});
