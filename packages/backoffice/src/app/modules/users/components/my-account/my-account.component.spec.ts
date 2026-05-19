import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { Observable } from "rxjs";

import { MyAccountComponent } from "./my-account.component";

import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";

import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { USER_PRO_MOCK } from "../../../../../../mocks/USER_PRO.mock";
import { User } from "../../classes";

describe("MyAccountComponent", () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAccountComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountComponent);
    usersService = TestBed.inject(UsersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("doit mettre à jour les données", () => {
    let formValues = component.getFormValue();
    expect(formValues.name).toBe(component.user.name);
    component.f.name.setValue("Bar");
    formValues = component.getFormValue();
    expect(formValues.name).toBe("Bar");
  });

  it("doit mettre à jour l'user quand les données sont mises à jour", () => {
    component.me = new User(USER_PRO_MOCK);

    expect(component.me.translator).toBe(false);
    jest.spyOn(usersService, "updateMyAccount").mockReturnValue(
      new Observable((subscriber) => {
        subscriber.next({ ...new User(USER_PRO_MOCK), translator: true });
        expect(component.me).toStrictEqual({
          ...USER_PRO_MOCK,
          translator: true,
        });
        subscriber.complete();
      })
    );
  });
});
