import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { AdminUserComponent } from "./admin-user.component";
import { AuthService } from "../../../users/services/auth.service";
import { UsersService } from "../../../users/services/users.service";
import { USER_PRO_MOCK } from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { User } from "../../../users/classes";

describe("AdminUserComponent", () => {
  let component: AdminUserComponent;
  let fixture: ComponentFixture<AdminUserComponent>;
  let userService: UsersService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: "5fb648823cb90874d9ab1bef",
              },
            },
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserComponent);
    userService = TestBed.inject(UsersService);
    jest
      .spyOn(userService, "getUser")
      .mockReturnValue(of(new User(USER_PRO_MOCK)));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update form data", () => {
    let formValues = component.updateForm.value;
    expect(formValues.name).toBe(component.user.name);
    component.f.name.setValue("Bar");
    formValues = component.updateForm.value;
    expect(formValues.name).toBe("Bar");
  });
});
