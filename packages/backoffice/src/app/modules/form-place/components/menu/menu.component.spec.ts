import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { of } from "rxjs";

import { FormMenuPlaceComponent } from "./menu.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { AuthService } from "../../../users/services/auth.service";

import {
  ONLINE_PLACE_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";

describe("FormMenuPlaceComponent", () => {
  let component: FormMenuPlaceComponent;
  let fixture: ComponentFixture<FormMenuPlaceComponent>;
  let adminPlaceService: AdminPlaceService;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormMenuPlaceComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMenuPlaceComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    authService = TestBed.inject(AuthService);
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(false));
    jest
      .spyOn(authService, "currentUserValue", "get")
      .mockReturnValue(USER_SOLIGUIDE_MOCK);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
