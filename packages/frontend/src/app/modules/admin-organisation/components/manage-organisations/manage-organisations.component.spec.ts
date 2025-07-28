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
import { FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { BehaviorSubject, of } from "rxjs";

import { ManageOrganisationsComponent } from "./manage-organisations.component";

import { OrganisationService } from "../../services/organisation.service";

import { ManageCommonModule } from "../../../manage-common/manage-common.module";

import { SharedModule } from "../../../shared/shared.module";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { ORGANIZATION_MOCK } from "../../../../../../mocks/ORGANIZATION.mock";
import { USER_SOLIGUIDE_MOCK } from "../../../../../../mocks/USER_SOLIGUIDE.mock";
import { SearchResults } from "@soliguide/common";
import { Organisation } from "../../interfaces";
import { registerLocales } from "../../../../shared";

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

const FAKE_SEARCH_ORGAS_RESULTS: SearchResults<Organisation> = {
  nbResults: 1,
  results: [ORGANIZATION_MOCK],
};

describe("ManageOrganisationsComponent", () => {
  let component: ManageOrganisationsComponent;
  let fixture: ComponentFixture<ManageOrganisationsComponent>;
  let organisationService: OrganisationService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOrganisationsComponent],
      imports: [
        ClipboardModule,
        FormsModule,
        HttpClientTestingModule,
        ManageCommonModule,
        NgbModule,
        SharedModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganisationsComponent);
    organisationService = TestBed.inject(OrganisationService);
    jest
      .spyOn(window, "scroll")
      .mockImplementation((x, y) => window.scrollTo({ left: x, top: y }));
    jest
      .spyOn(organisationService, "searchOrga")
      .mockReturnValue(of(FAKE_SEARCH_ORGAS_RESULTS));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select the correct fields with multiselect", () => {
    component.setRelations(["ASSOCIATION"]);
    expect(component.search.relations).toStrictEqual(["ASSOCIATION"]);

    component.setUserTypes(["USERS"]);
    expect(component.search.userTypes).toStrictEqual(["USERS"]);
  });
});
