import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { of } from "rxjs";

import { SignupTradComponent } from "./signup-trad.component";

import { UsersService } from "../../services/users.service";

describe("SignupComponentTrad", () => {
  let component: SignupTradComponent;
  let fixture: ComponentFixture<SignupTradComponent>;
  let usersService: UsersService;
  let toastr: ToastrService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignupTradComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/register" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupTradComponent);

    usersService = TestBed.inject(UsersService);
    toastr = TestBed.inject(ToastrService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should signup", () => {
    component.f.cgu.setValue(true);
    component.f.languages.setValue(["ru"]);
    component.f.mail.setValue("translator@mail.com");
    component.f.name.setValue("nickname");
    component.f.password.setValue("PasswordForTest123!");
    component.f.passwordConfirmation.setValue("PasswordForTest123!");
    component.f.translator.setValue(true);
    component.f.cgu.setValue(true);

    jest
      .spyOn(usersService, "signupTranslator")
      .mockReturnValue(of({ message: "translator" }));
    jest.spyOn(toastr, "success");

    component.signup();

    expect(component.loading).toBe(false);
    expect(component.success).toBe(true);
    expect(toastr.success).toHaveBeenCalledWith("SUCCESSFUL_SIGNUP");
  });

  it("doit mettre à jour les données", () => {
    let formValues = component.getFormValue();
    expect(formValues.mail).toBe(component.user.mail);

    component.f.mail.setValue("new@mail.com");
    formValues = component.getFormValue();

    expect(formValues.mail).toBe("new@mail.com");
  });
});
