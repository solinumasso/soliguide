import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserPasswordFormComponent } from "./user-password-form.component";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PASSWORD_VALIDATOR } from "../../constants";
import { PasswordValidator } from "../../services/password-validator.service";

const newPasswordForm = () => {
  return new FormGroup(
    {
      oldPassword: new FormControl(
        null,
        Validators.compose(PASSWORD_VALIDATOR)
      ),
      passwordConfirmation: new FormControl(
        null,
        Validators.compose(PASSWORD_VALIDATOR)
      ),
      password: new FormControl(null, Validators.compose(PASSWORD_VALIDATOR)),
    },
    {
      validators: [PasswordValidator.passwordMatchValidator],
    }
  );
};

describe("UserPasswordFormComponent", () => {
  let component: UserPasswordFormComponent;
  let fixture: ComponentFixture<UserPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPasswordFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Should build password form", () => {
    component.parentFormGroup = newPasswordForm();
    component.parentFormGroup.controls.oldPassword.setValue("");
    expect(component.parentFormGroup.valid).toBeFalsy();

    component.parentFormGroup.controls.oldPassword.setValue("3Mxx!8ZnhST_zaa");

    component.parentFormGroup.controls.password.setValue("4uxxxtmS8TB!D983E");
    component.parentFormGroup.controls.passwordConfirmation.setValue(
      "4uxxxtmS8TB!D983E"
    );
    expect(component.parentFormGroup.valid).toBeTruthy();

    expect(component.hidePassword).toBe(true);
    expect(component.hidePasswordConfirmationation).toBe(true);

    component.togglePassword();
    component.togglePasswordConfirmation();

    expect(component.hidePassword).toBe(false);
    expect(component.hidePasswordConfirmationation).toBe(false);
  });

  it("Correct password", () => {
    const testPasswords = [
      "Azerty0123456)}",
      "LsKVYkXBxDR3!",
      "!!!!!!V3K5nWvq84Fj",
      "  §'/(//(nvew3gKvzgKn",
      "x$rQAzhma!W(2Fzuk",
      "Allez les bleus2022(",
      "cpXJydcMV7WjuVc7E2nDIpgHvt)LXhexqh#HvSVN8W6u&x8*LnmXVU&m@5uzfrD",
    ];
    component.parentFormGroup = newPasswordForm();

    component.parentFormGroup.controls.oldPassword.setValue("3Mxx!8ZnhST_zaa");
    testPasswords.forEach((value: string) => {
      component.parentFormGroup.controls.password.setValue(value);
      component.parentFormGroup.controls.passwordConfirmation.setValue(value);

      expect(component.parentFormGroup.valid).toBe(true);
    });
  });

  it("Wrong password", () => {
    component.parentFormGroup = newPasswordForm();
    component.parentFormGroup.controls.oldPassword.setValue("3Mxx!8ZnhST_zaa");
    const testPasswords = [
      "Azerty01234",
      "azerty01234564564",
      "LsKVYk",
      "123456879964661",
      "AZERTYU001235",
      "<<<<<<<<<<<<<<>>>>>>>>>>>>>>",
      null,
      undefined,
      "",
      "                  ",
      "cpXJydcMV7WjuVc7E2nDIpgHvt)LXhexqh#HvSVN8W6u&x8*LnmXVU&m@5uzfrDcpXJydcMV7WjuVc7E2nDIpgHvt)LXhexqh#HvSVN8W6u&x8*LnmXVU&m@5uzfrDMV7WjuVc7E2nDIpgHvt)LXhexqh#HvSVN8W6u&x8*LnmXVU&m@5uzfrDcpXJydcMV7WjuVc7E2nDIpgHvt)LXhexqh#HvSVN8W6u&x8*LnmXVU&m@5uzfrD",
    ];

    testPasswords.forEach((value) => {
      component.parentFormGroup.controls.password.setValue(value);
      component.parentFormGroup.controls.passwordConfirmation.setValue(value);
      expect(component.parentFormGroup.valid).toBe(false);
    });
  });
});
