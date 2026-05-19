import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { SharedModule } from "../../../shared/shared.module";

import { ManageRolesComponent } from "./manage-roles.component";

import {
  INVITATION_MOCK,
  ORGANIZATION_MOCK,
  USER_INVITED_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";

INVITATION_MOCK.organization = ORGANIZATION_MOCK;
INVITATION_MOCK.user = USER_INVITED_MOCK;
INVITATION_MOCK.user_id = USER_INVITED_MOCK.user_id;
ORGANIZATION_MOCK.invitations = [INVITATION_MOCK];

describe("ManageRolesComponent", () => {
  let component: ManageRolesComponent;
  let fixture: ComponentFixture<ManageRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRolesComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolesComponent);

    component = fixture.componentInstance;

    component.organisation = ORGANIZATION_MOCK;
    component.me = USER_SOLIGUIDE_MOCK;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
