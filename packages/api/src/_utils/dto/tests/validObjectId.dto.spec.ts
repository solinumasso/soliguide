import mongoose from "mongoose";

import {
  parseObjectIdOptionalDto,
  parseServiceObjectIdDto,
  validObjectIdDto,
} from "../validObjectId.dto";
import {
  ALL_INJECTIONS,
  NON_EMPTY_INJECTIONS,
} from "../../tests/injection-payloads";
import { expectAccepted, expectRejected, runDto } from "../../tests/run-dto";

const VALID_ID = "507f1f77bcf86cd799439011";

describe("validObjectIdDto", () => {
  it("should accept a real ObjectId", async () => {
    expectAccepted(await runDto(validObjectIdDto, { body: { _id: VALID_ID } }));
  });

  it("should refuse a missing identifier", async () => {
    expectRejected(await runDto(validObjectIdDto, { body: {} }));
  });

  it("should refuse a twelve-character string, which ObjectId.isValid accepts", async () => {
    expectRejected(
      await runDto(validObjectIdDto, { body: { _id: "identifiant" } })
    );
  });

  it("should refuse a number, which ObjectId.isValid also accepts", async () => {
    expectRejected(await runDto(validObjectIdDto, { body: { _id: 12345678 } }));
  });

  it.each(ALL_INJECTIONS)("should refuse $label", async ({ value }) => {
    const result = await runDto(validObjectIdDto, { body: { _id: value } });

    expectRejected(result);
    expect(result.data._id).toBeUndefined();
  });
});

describe("parseObjectIdOptionalDto", () => {
  it("should convert a valid identifier", async () => {
    const result = await runDto(parseObjectIdOptionalDto, {
      body: { _id: VALID_ID },
    });

    expectAccepted(result);
    expect(result.data._id).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(String(result.data._id)).toBe(VALID_ID);
  });

  it("should accept an absent identifier", async () => {
    expectAccepted(await runDto(parseObjectIdOptionalDto, { body: {} }));
  });

  it.each([null, ""])(
    "should read %p as a request to clear the reference",
    async (value) => {
      const result = await runDto(parseObjectIdOptionalDto, {
        body: { _id: value },
      });

      expectAccepted(result);
      expect(result.data._id ?? null).toBeNull();
    }
  );

  it.each(NON_EMPTY_INJECTIONS)(
    "should refuse $label instead of building an ObjectId from it",
    async ({ value }) => {
      const result = await runDto(parseObjectIdOptionalDto, {
        body: { _id: value },
      });

      // The conversion must never run on a value the check refused: a BSON error
      // raised inside a sanitizer escapes the chain and answers 500.
      expect(result.thrown).toBeUndefined();
      expect(result.data._id).toBeUndefined();
    }
  );
});

describe("parseServiceObjectIdDto", () => {
  it("should convert a valid service identifier", async () => {
    const result = await runDto(parseServiceObjectIdDto, {
      body: { serviceObjectId: VALID_ID },
    });

    expectAccepted(result);
    expect(result.data.serviceObjectId).toBeInstanceOf(mongoose.Types.ObjectId);
  });

  it.each(NON_EMPTY_INJECTIONS)("should refuse $label", async ({ value }) => {
    const result = await runDto(parseServiceObjectIdDto, {
      body: { serviceObjectId: value },
    });

    expect(result.thrown).toBeUndefined();
    expect(result.data.serviceObjectId).toBeUndefined();
  });
});
