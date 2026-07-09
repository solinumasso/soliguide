import { PlaceModel } from "@soliguide/api";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { V20260426MongoContextProvider } from "./mongo-context.adapter";

vi.mock("@soliguide/api", () => ({
  PlaceModel: {
    find: vi.fn(),
  },
}));

describe("V20260426MongoContextProvider", () => {
  const provider = new V20260426MongoContextProvider();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries numeric lieu_id values separately from Mongo ObjectIds", async () => {
    const mongoId = "507f1f77bcf86cd799439011";
    const exec = vi.fn().mockResolvedValue([
      {
        _id: mongoId,
        lieu_id: 38,
        sourceLanguage: "fr",
      },
    ]);
    const lean = vi.fn(() => ({ exec }));

    (PlaceModel.find as Mock).mockReturnValue({ lean });

    const context = await provider.getContext({
      fromVersion: "2026-04-26",
      payload: {
        places: [
          {
            _id: mongoId,
            lieu_id: 38,
          },
        ],
      },
      resourceName: "search-response",
      toVersion: "2026-01-01",
    });

    expect(PlaceModel.find).toHaveBeenCalledWith({
      $or: [
        { lieu_id: { $in: [38] } },
        { _id: { $in: [mongoId] } },
      ],
    });
    expect(context.legacyPlacesById["38"]).toEqual({
      _id: mongoId,
      lieu_id: 38,
      sourceLanguage: "fr",
    });
    expect(context.legacyPlacesById[mongoId]).toEqual({
      _id: mongoId,
      lieu_id: 38,
      sourceLanguage: "fr",
    });
  });

  it("does not query _id with numeric strings", async () => {
    const exec = vi.fn().mockResolvedValue([{ lieu_id: 38 }]);
    const lean = vi.fn(() => ({ exec }));

    (PlaceModel.find as Mock).mockReturnValue({ lean });

    await provider.getContext({
      fromVersion: "2026-04-26",
      payload: {
        places: [
          {
            lieu_id: "38",
          },
        ],
      },
      resourceName: "search-response",
      toVersion: "2026-01-01",
    });

    expect(PlaceModel.find).toHaveBeenCalledWith({
      $or: [{ lieu_id: { $in: [38] } }],
    });
  });
});
