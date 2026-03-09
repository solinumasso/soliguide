import "./userRight.model";

import { DEFAULT_USER_PROPS } from "../constants/DEFAULT_USER_PROPS.const";

import { UserModel } from "../models/user.model";

import "../../organization/models/organization.model";
import "../../place/models/place.model";

describe("UserModel", () => {
  const testUser = {
    ...DEFAULT_USER_PROPS,
    user_id: 0,
    mail: "toto@toto.toto",
    name: "toto",
    lastname: "toto",
    password: "plop",
  };

  it("must create a user model with no territories and languages", async () => {
    const user = new UserModel({
      ...testUser,
    });
    await user.validate();
    expect(user).not.toBeNull();
    expect(user._id).not.toBeUndefined();
    expect(user._id).not.toBeNull();
    expect(user.territories).not.toBeUndefined();
    expect(user.territories).not.toBeNull();
    expect(user.areas).toBeUndefined();
  });

  it("must create a user model with valid territories", async () => {
    const user = new UserModel({
      ...testUser,
      territories: ["01", "09"],
    });
    await user.validate();
    expect(user.territories).toStrictEqual(["01", "09"]);
  });

  it("must not create a user model with invalid territories", () => {
    const user = new UserModel({
      ...testUser,
      territories: ["44", "123"],
    });

    user
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "User validation failed: territories.1: `123` is not a valid enum value for path `territories.1`."
        )
      );
  });

  it("must create an user model with valid languages", async () => {
    const user = new UserModel({
      ...testUser,
      languages: ["en", "ar"],
    });
    await user.validate();
    expect(user.languages).toStrictEqual(["en", "ar"]);
  });

  it("must create an user model with invalid languages", () => {
    const user = new UserModel({
      ...testUser,
      languages: ["en", "ar", "vb"],
    });
    user
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "User validation failed: languages: Path languages is not a list of valid languages"
        )
      );
  });
});
