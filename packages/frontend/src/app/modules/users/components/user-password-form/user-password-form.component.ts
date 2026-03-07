import { Component, Input } from "@angular/core";
import type { UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-user-password-form",
  templateUrl: "./user-password-form.component.html",
  styleUrls: ["./user-password-form.component.css"],
})
export class UserPasswordFormComponent {
  @Input() public submitted!: boolean;
  @Input() public parentFormGroup!: UntypedFormGroup;

  public hidePassword: boolean;
  public hidePasswordConfirmationation: boolean;

  public password: string;
  public passwordConfirmation: string;

  constructor() {
    this.submitted = false;
    this.hidePassword = true;
    this.hidePasswordConfirmationation = true;
    this.password = "";
    this.passwordConfirmation = "";
  }

  public setPassword(value: string): void {
    this.parentFormGroup.controls.password.setValue(value);
  }

  public setPasswordConfirmation(value: string): void {
    this.parentFormGroup.controls.passwordConfirmation.setValue(value);
  }

  public togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  public togglePasswordConfirmation(): void {
    this.hidePasswordConfirmationation = !this.hidePasswordConfirmationation;
  }
}
