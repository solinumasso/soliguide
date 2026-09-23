import mongoose from "mongoose";

import { CounterModel } from "../models/counter.model";
import { getNextSequence } from "./sequence.service";

const SEQUENCE_NAME = "test_sequence";
const HIGHEST_EXISTING_VALUE = 42;

describe("getNextSequence", () => {
  const readHighestExistingValue = jest
    .fn()
    .mockResolvedValue(HIGHEST_EXISTING_VALUE);

  beforeEach(async () => {
    await CounterModel.deleteOne({ _id: SEQUENCE_NAME });
    readHighestExistingValue.mockClear();
  });

  afterAll(async () => {
    try {
      await CounterModel.deleteOne({ _id: SEQUENCE_NAME });
    } finally {
      await mongoose.connection.close();
    }
  });

  it("starts above the identifiers already stored when the counter is missing", async () => {
    const allocatedId = await getNextSequence(
      SEQUENCE_NAME,
      readHighestExistingValue
    );

    expect(allocatedId).toEqual(HIGHEST_EXISTING_VALUE + 1);
  });

  it("reads the stored identifiers only while the counter does not exist", async () => {
    await getNextSequence(SEQUENCE_NAME, readHighestExistingValue);
    await getNextSequence(SEQUENCE_NAME, readHighestExistingValue);

    expect(readHighestExistingValue).toHaveBeenCalledTimes(1);
  });

  it("increases by one on every allocation", async () => {
    const firstId = await getNextSequence(
      SEQUENCE_NAME,
      readHighestExistingValue
    );
    const secondId = await getNextSequence(
      SEQUENCE_NAME,
      readHighestExistingValue
    );

    expect(secondId).toEqual(firstId + 1);
  });

  it("never hands out the same identifier twice under concurrency", async () => {
    const numberOfConcurrentCalls = 20;
    const callIndexes = [...Array(numberOfConcurrentCalls).keys()];

    const allocatedIds = await Promise.all(
      callIndexes.map(() =>
        getNextSequence(SEQUENCE_NAME, readHighestExistingValue)
      )
    );

    expect(new Set(allocatedIds).size).toEqual(numberOfConcurrentCalls);
  });
});
