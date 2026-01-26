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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { BehaviorSubject, of } from "rxjs";

import { FormOrganisationComponent } from "./form-organisation.component";

import { OrganisationService } from "../../services/organisation.service";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { ORGANIZATION_MOCK } from "../../../../../../mocks/ORGANIZATION.mock";
import { USER_PRO_MOCK } from "../../../../../../mocks/USER_PRO.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

class MockAuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      new User(USER_PRO_MOCK)
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

describe("FormOrganisationComponent", () => {
  let component: FormOrganisationComponent;
  let fixture: ComponentFixture<FormOrganisationComponent>;
  let organisationService: OrganisationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormOrganisationComponent],
      imports: [
        FontAwesomeModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: "2316",
              },
            },
          },
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        // For CKEditor
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOrganisationComponent);
    organisationService = TestBed.inject(OrganisationService);
    jest
      .spyOn(organisationService, "get")
      .mockReturnValue(of(ORGANIZATION_MOCK));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select the correct relations", () => {
    component.toggleCheckboxButton("relations", "ASSOCIATION");
    expect(component.f.relations.value).toStrictEqual(["ASSOCIATION"]);

    component.toggleCheckboxButton("relations", "API");
    expect(component.f.relations.value).toStrictEqual(["ASSOCIATION", "API"]);

    component.toggleCheckboxButton("relations", "PUBLIC_SERVICE");
    expect(component.f.relations.value).toStrictEqual([
      "ASSOCIATION",
      "API",
      "PUBLIC_SERVICE",
    ]);

    component.toggleCheckboxButton("relations", "API");
    expect(component.f.relations.value).toStrictEqual([
      "ASSOCIATION",
      "PUBLIC_SERVICE",
    ]);

    component.toggleCheckboxButton("relations", "API");
    expect(component.f.relations.value).toStrictEqual([
      "ASSOCIATION",
      "PUBLIC_SERVICE",
      "API",
    ]);
  });
});
