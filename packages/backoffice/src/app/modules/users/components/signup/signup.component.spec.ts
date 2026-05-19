import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { SignupComponent } from "./signup.component";
import { MockAuthService } from "../../../../../../mocks";
import { AuthService } from "../../services/auth.service";

describe("SignupComponent", () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/register" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("doit mettre à jour les données", () => {
    component.f.lastname.setValue("Gagnaire");
    component.f.mail.setValue("pgagnaire@restoducoeur.fr");
    component.f.name.setValue("Pierre");
    component.f.phone.setValue("0606060606");
    component.f.title.setValue("Chef d'exception");
    const formValues = component.getFormValue();
    expect(formValues.mail).toBe("pgagnaire@restoducoeur.fr");
  });
});
