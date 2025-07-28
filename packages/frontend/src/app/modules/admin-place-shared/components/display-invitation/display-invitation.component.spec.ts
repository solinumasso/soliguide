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
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { INVITATION_MOCK } from "./../../../../../../mocks/INVITATION.mock";
import { ToastrModule } from "ngx-toastr";
import { AdminPlaceSharedModule } from "./../../admin-place-shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayInvitationComponent } from "./display-invitation.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

describe("DisplayInvitationComponent", () => {
  let component: DisplayInvitationComponent;
  let fixture: ComponentFixture<DisplayInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayInvitationComponent],
      imports: [
        HttpClientTestingModule,
        AdminPlaceSharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
        FontAwesomeModule,
        RouterModule.forRoot([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayInvitationComponent);
    component = fixture.componentInstance;
    component.invitations = [INVITATION_MOCK];
    component.indexTable = 1;
    component.tableName = "orgas";
    component.loading = false;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
