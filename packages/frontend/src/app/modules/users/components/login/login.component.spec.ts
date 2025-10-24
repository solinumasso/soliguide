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
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { LoginComponent } from "./login.component";

import { AuthService } from "../../services/auth.service";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";

import {
  USER_PRO_MOCK,
  CommonPosthogMockService,
} from "../../../../../../mocks";
import { User } from "../../classes";

const setInputValue = (
  inputElement: HTMLInputElement,
  value: string | null
): void => {
  inputElement.value = value ?? "";
  inputElement.dispatchEvent(new Event("input"));
};

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let emailInput: HTMLInputElement;
  let pwdInput: HTMLInputElement;
  let authService: AuthService;

  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/organisations/${USER_PRO_MOCK.organizations[0].organization_id}`,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;
    emailInput = fixture.debugElement.nativeElement.querySelector(
      "input[type='email']"
    );
    pwdInput = fixture.debugElement.nativeElement.querySelector("#password");

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    jest
      .spyOn(authService, "login")
      .mockReturnValue(of(new User(USER_PRO_MOCK)));
    jest.spyOn(router, "navigate").mockReturnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should sign in as pro user", fakeAsync(() => {
    setInputValue(emailInput, USER_PRO_MOCK.mail);
    setInputValue(pwdInput, "xxx");

    tick(1000);
    component.login();

    expect(component.loading).toBe(false);
    expect(router.navigate).toHaveBeenCalled();
  }));
});
