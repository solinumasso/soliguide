import { inject, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { PasswordValidator } from "./password-validator.service";

describe("PasswordValidatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [PasswordValidator],
    });
  });

  it("should be created", inject(
    [PasswordValidator],
    (validator: PasswordValidator) => {
      expect(validator).toBeTruthy();
    }
  ));
});
