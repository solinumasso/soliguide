import { PlaceStatus } from "@soliguide/common";

import { findActiveLieuIds } from "./place.service";
import { PlaceModel } from "../models/place.model";

/** Stubs PlaceModel.find(...).lean().exec() to resolve to the given docs. */
const givenActivePlaces = (
  docs: Array<{ lieu_id: number }>
): jest.SpyInstance =>
  jest.spyOn(PlaceModel, "find").mockReturnValue({
    lean: () => ({ exec: () => Promise.resolve(docs) }),
  } as never);

describe("findActiveLieuIds", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns an empty array without querying when there is no candidate", async () => {
    const findSpy = jest.spyOn(PlaceModel, "find");

    const result = await findActiveLieuIds([]);

    expect(result).toEqual([]);
    expect(findSpy).not.toHaveBeenCalled();
  });

  it("keeps only the ONLINE/OFFLINE places among the candidates and returns their lieu_id", async () => {
    const findSpy = givenActivePlaces([{ lieu_id: 1 }, { lieu_id: 3 }]);

    const result = await findActiveLieuIds([1, 2, 3]);

    expect(result).toEqual([1, 3]);
    expect(findSpy).toHaveBeenCalledWith(
      {
        lieu_id: { $in: [1, 2, 3] },
        status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
      },
      { lieu_id: 1, _id: 0 }
    );
  });
});
