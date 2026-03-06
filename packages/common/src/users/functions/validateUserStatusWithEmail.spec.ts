
import { DOMAINS_ADMIN_TERRITORIES } from "../constants";
import { UserStatus } from "../enums";
import { validateUserStatusWithEmail } from "./validateUserStatusWithEmail";

describe("validateUserStatusWithEmail", () => {
  it("should return { required: true } if email is not provided", () => {
    expect(validateUserStatusWithEmail(UserStatus.ADMIN_SOLIGUIDE)).toEqual({
      required: true,
    });
  });

  it("should return { invalidAdminSoliguideEmail: true } if ADMIN_SOLIGUIDE status and email domain is not solinum.org", () => {
    expect(
      validateUserStatusWithEmail(
        UserStatus.ADMIN_SOLIGUIDE,
        "user@example.com"
      )
    ).toEqual({ invalidAdminSoliguideEmail: true });
  });

  it("should return { invalidAdminSoliguideEmail: true } if ADMIN_SOLIGUIDE status and email domain is not solinum.org", () => {
    expect(
      validateUserStatusWithEmail(UserStatus.SOLI_BOT, "user@example.com")
    ).toEqual({ invalidAdminSoliguideEmail: true });
  });

  it("should return null if ADMIN_SOLIGUIDE status and email domain is solinum.org", () => {
    expect(
      validateUserStatusWithEmail(
        UserStatus.ADMIN_SOLIGUIDE,
        "user@solinum.org"
      )
    ).toBeNull();
  });

  it("should return { invalidAdminTerritoryEmail: true } if ADMIN_TERRITORY status and email domain is not in DOMAINS_ADMIN_TERRITORIES", () => {
    expect(
      validateUserStatusWithEmail(
        UserStatus.ADMIN_TERRITORY,
        "user@example.com"
      )
    ).toEqual({ invalidAdminTerritoryEmail: true });
  });

  it.each(DOMAINS_ADMIN_TERRITORIES)(
    "should return null if ADMIN_TERRITORY status and email domain is in DOMAINS_ADMIN_TERRITORIES: %s",
    async (mail) => {
      expect(
        validateUserStatusWithEmail(UserStatus.ADMIN_TERRITORY, mail)
      ).toBeNull();
    }
  );

  it("should return { invalidSimpleUserEmail: true } if email domain is solinum.org and status is not admin", () => {
    expect(
      validateUserStatusWithEmail(UserStatus.SIMPLE_USER, "user@solinum.org")
    ).toEqual({ invalidSimpleUserEmail: true });
  });

  it("should return { invalidSimpleUserEmail: true } if email domain is in DOMAINS_ADMIN_TERRITORIES and status is not admin", () => {
    DOMAINS_ADMIN_TERRITORIES.push("validterritory.org");
    expect(
      validateUserStatusWithEmail(
        UserStatus.SIMPLE_USER,
        "user@validterritory.org"
      )
    ).toEqual({ invalidSimpleUserEmail: true });
  });

  it("should return null if email domain is not solinum.org or in DOMAINS_ADMIN_TERRITORIES and status is not admin", () => {
    expect(
      validateUserStatusWithEmail(UserStatus.SIMPLE_USER, "user@example.com")
    ).toBeNull();
  });

  it("should return null if email domain is solinum.org and status is SOLI_BOT", () => {
    expect(
      validateUserStatusWithEmail(UserStatus.SOLI_BOT, "user@solinum.org")
    ).toBeNull();
  });

  it("should return null if email domain is not in DOMAINS_ADMIN_TERRITORIES and status is not admin", () => {
    expect(
      validateUserStatusWithEmail(UserStatus.SIMPLE_USER, "user@example.com")
    ).toBeNull();
  });
});
