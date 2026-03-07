import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "@soliguide/common";
import { model } from "mongoose";

import { PublicsSchema } from "../publics.model";

describe("PublicsSchema", () => {
  const PublicsModel = model("Publics", PublicsSchema);

  it("must create a publics model with no value in administrative, family and other situations as well as genders", async () => {
    const publics = new PublicsModel({});

    await publics.validate();

    expect(publics).not.toBeNull();
    expect(publics.administrative).toStrictEqual(ADMINISTRATIVE_DEFAULT_VALUES);
    expect(publics.familialle).toStrictEqual(FAMILY_DEFAULT_VALUES);
    expect(publics.gender).toStrictEqual(GENDER_DEFAULT_VALUES);
    expect(publics.other).toStrictEqual(OTHER_DEFAULT_VALUES);
  });

  it("must create publics model with valid administrative situations", async () => {
    const publics = new PublicsModel({
      administrative: [
        PublicsAdministrative.asylum,
        PublicsAdministrative.refugee,
      ],
    });

    await publics.validate();

    expect(publics.administrative).toStrictEqual([
      PublicsAdministrative.asylum,
      PublicsAdministrative.refugee,
    ]);
  });

  it("must create publics model with invalid administrative situations", async () => {
    const publics = new PublicsModel({
      administrative: [PublicsAdministrative.asylum, "disabled"],
    });

    publics
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "Publics validation failed: administrative: Path administrative is not a list of valid administrative situations"
        )
      );
  });

  it("must create publics model with valid family situations", async () => {
    const publics = new PublicsModel({
      familialle: [PublicsFamily.couple, PublicsFamily.pregnant],
    });

    await publics.validate();

    expect(publics.familialle).toStrictEqual([
      PublicsFamily.couple,
      PublicsFamily.pregnant,
    ]);
  });

  it("must create publics model with invalid family situations", async () => {
    const publics = new PublicsModel({
      familialle: [PublicsFamily.couple, "disabled"],
    });

    publics
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "Publics validation failed: familialle: Path familialle is not a list of valid family situations"
        )
      );
  });

  it("must create publics model with valid genders", async () => {
    const publics = new PublicsModel({
      gender: [PublicsGender.women],
    });

    await publics.validate();

    expect(publics.gender).toStrictEqual([PublicsGender.women]);
  });

  it("must create publics model with invalid genders", async () => {
    const publics = new PublicsModel({
      gender: [PublicsGender.women, "disabled"],
    });

    publics
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "Publics validation failed: gender: Path gender is not a list of valid genders"
        )
      );
  });

  it("must create publics model with valid other situations", async () => {
    const publics = new PublicsModel({
      other: [PublicsOther.addiction, PublicsOther.hiv],
    });

    await publics.validate();

    expect(publics.other).toStrictEqual([
      PublicsOther.addiction,
      PublicsOther.hiv,
    ]);
  });

  it("must create publics model with invalid other situations", async () => {
    const publics = new PublicsModel({
      other: [PublicsOther.addiction, "disabled"],
    });

    publics
      .validate()
      .then(() => fail())
      .catch((error) =>
        expect(error.message).toEqual(
          "Publics validation failed: other: Path other is not a list of valid other situations"
        )
      );
  });
});
