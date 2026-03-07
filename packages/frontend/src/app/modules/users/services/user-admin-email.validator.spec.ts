import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DOMAINS_ADMIN_TERRITORIES, UserStatus } from "@soliguide/common";
import { userAdminEmailValidator } from "./user-admin-email.validator";
import { EmailValidator } from "../../../shared";
describe("userAdminEmailValidator", () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      mail: new FormControl(null, [
        Validators.required,
        EmailValidator,
        userAdminEmailValidator("status"),
      ]),
      status: new FormControl(""),
    });
  });

  it("should return valid if status is SIMPLE_USER", () => {
    formGroup.get("status")?.setValue(UserStatus.SIMPLE_USER);
    formGroup.get("mail")?.setValue("xxx@xx.fr");

    expect(formGroup.status).toEqual("VALID");
  });

  it("should return { invalidAdminSoliguideEmail: true } if status is ADMIN_SOLIGUIDE and domain is not solinum.org", () => {
    formGroup.get("status")?.setValue(UserStatus.ADMIN_SOLIGUIDE);
    formGroup.get("mail")?.setValue("user@invalid.org");

    expect(formGroup.status).toEqual("INVALID");
  });

  it("should return null if status is ADMIN_SOLIGUIDE and domain is solinum.org", () => {
    formGroup.get("status")?.setValue(UserStatus.ADMIN_SOLIGUIDE);
    formGroup.get("mail")?.setValue("user@solinum.org");
    expect(formGroup.status).toEqual("VALID");
    expect(formGroup.get("mail")?.errors).toBeNull();
  });

  it("should return { invalidAdminTerritoryEmail: true } if status is ADMIN_TERRITORY and domain is not in DOMAINS_ADMIN_TERRITORIES", () => {
    formGroup.get("status")?.setValue(UserStatus.ADMIN_TERRITORY);
    formGroup.get("mail")?.setValue("user@invalid.org");
    expect(formGroup.status).toEqual("INVALID");
  });

  it("should return null if status is ADMIN_TERRITORY and domain is in DOMAINS_ADMIN_TERRITORIES", () => {
    formGroup.get("status")?.setValue(UserStatus.ADMIN_TERRITORY);
    formGroup.get("mail")?.setValue(`user@${DOMAINS_ADMIN_TERRITORIES[0]}`);
    expect(formGroup.status).toEqual("VALID");
  });

  it("should return invalidSimpleUserEmail if status is API_USER and domain is in DOMAINS_ADMIN_TERRITORIES", () => {
    formGroup.get("status")?.setValue(UserStatus.API_USER);
    formGroup.get("mail")?.setValue(`user@${DOMAINS_ADMIN_TERRITORIES[0]}`);
    expect(formGroup.status).toEqual("INVALID");
    expect(formGroup.get("mail")?.errors).toEqual({
      invalidSimpleUserEmail: true,
    });
  });
});
