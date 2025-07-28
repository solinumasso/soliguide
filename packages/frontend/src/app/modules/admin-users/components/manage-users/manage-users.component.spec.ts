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
import { ClipboardModule } from "@angular/cdk/clipboard";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { BehaviorSubject, of } from "rxjs";
import { ManageUsersComponent } from "./manage-users.component";
import { AdminUsersService } from "../../services/admin-users.service";
import { AdminPlaceSharedModule } from "../../../admin-place-shared/admin-place-shared.module";
import { ManageCommonModule } from "../../../manage-common/manage-common.module";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { SharedModule } from "../../../shared/shared.module";

import { USER_SOLIGUIDE_MOCK } from "../../../../../../mocks/USER_SOLIGUIDE.mock";
import { registerLocales } from "../../../../shared";
import { CommonUser, SearchResults } from "@soliguide/common";
import { COMMON_USER_PRO } from "../../../../../../mocks/COMMON_USER.mock";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

class MockAuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      USER_SOLIGUIDE_MOCK
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

const FAKE_SEARCH_USERS_RESULTS: SearchResults<CommonUser> = {
  nbResults: 1,
  results: [{ ...COMMON_USER_PRO }],
};

describe("ManageUsersComponent", () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let adminUsersService: AdminUsersService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AdminPlaceSharedModule,
        ClipboardModule,
        FormsModule,
        HttpClientTestingModule,
        ManageCommonModule,
        NgbModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      declarations: [ManageUsersComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersComponent);
    adminUsersService = TestBed.inject(AdminUsersService);
    jest
      .spyOn(window, "scroll")
      .mockImplementation((x, y) => window.scrollTo({ left: x, top: y }));
    jest
      .spyOn(adminUsersService, "searchUsers")
      .mockReturnValue(of(FAKE_SEARCH_USERS_RESULTS));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
