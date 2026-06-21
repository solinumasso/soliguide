import { Exchange, RoutingKey } from "../../events/enums";
import { PlaceModel } from "../models";
import { isPlaceOpenToday } from "../utils";
import { amqpEventsSender } from "../../events";
import { setIsOpenToday } from "./isOpenToday.service";

// Mock the data layer: we drive find/countDocuments/bulkWrite directly
jest.mock("../models", () => ({
  PlaceModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    bulkWrite: jest.fn().mockResolvedValue({}),
  },
}));

// Mock the place utils consumed by the service
jest.mock("../utils", () => ({
  isPlaceOpenToday: jest.fn(),
  isServiceOpenToday: jest.fn().mockResolvedValue(false),
  getThemeAndUrlFromPlace: jest
    .fn()
    .mockReturnValue({ theme: "SOLIGUIDE_FR", frontendUrl: "https://front/" }),
}));

// Mock the events module: keep real enums, stub the sender and the event class
jest.mock("../../events", () => {
  const enums = jest.requireActual("../../events/enums");
  return {
    ...enums,
    amqpEventsSender: {
      sendToQueue: jest.fn().mockResolvedValue(undefined),
    },
    // Lightweight stand-in that captures the place state at construction time
    AmqpSynchroAirtablePlaceEvent: jest
      .fn()
      .mockImplementation(
        (place: { lieu_id: number; isOpenToday: boolean }) => ({
          placeId: place.lieu_id,
          isOpenToday: place.isOpenToday,
        })
      ),
  };
});

const mockedPlaceModel = PlaceModel as unknown as {
  countDocuments: jest.Mock;
  find: jest.Mock;
  bulkWrite: jest.Mock;
};
const mockedIsPlaceOpenToday = isPlaceOpenToday as jest.Mock;
const mockedSendToQueue = amqpEventsSender.sendToQueue as jest.Mock;

/**
 * Builds a chainable Mongoose query stub: find().sort().limit().lean()
 */
const buildQueryStub = (places: unknown[]) => {
  const query: Record<string, jest.Mock> = {};
  query.sort = jest.fn().mockReturnValue(query);
  query.limit = jest.fn().mockReturnValue(query);
  query.lean = jest.fn().mockResolvedValue(places);
  return query;
};

const buildPlace = (
  lieu_id: number,
  isOpenToday: boolean | undefined
): Record<string, unknown> => ({
  _id: `id-${lieu_id}`,
  lieu_id,
  isOpenToday,
  services_all: [],
});

/** Wires countDocuments + find so the service iterates the given places once. */
const givenPlaces = (places: Record<string, unknown>[]): void => {
  mockedPlaceModel.countDocuments.mockResolvedValue(places.length);
  mockedPlaceModel.find.mockReturnValue(buildQueryStub(places));
};

describe("setIsOpenToday - diff-only Airtable synchro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("emits a synchro event only for places whose place-level isOpenToday changed", async () => {
    givenPlaces([
      buildPlace(1, false), // false -> true : changed, must emit
      buildPlace(2, true), // true -> true : unchanged, no emit
      buildPlace(3, undefined), // (undefined => false) -> false : unchanged, no emit
    ]);

    const newValueByPlace: Record<number, boolean> = {
      1: true,
      2: true,
      3: false,
    };
    mockedIsPlaceOpenToday.mockImplementation((place: { lieu_id: number }) =>
      Promise.resolve(newValueByPlace[place.lieu_id])
    );

    await setIsOpenToday();

    expect(mockedSendToQueue).toHaveBeenCalledTimes(1);

    const [exchange, routingKey, payload] = mockedSendToQueue.mock.calls[0];
    expect(exchange).toBe(Exchange.PLACES);
    expect(routingKey).toBe(`${RoutingKey.PLACES}.synchro_at`);
    expect(payload).toEqual({ placeId: 1, isOpenToday: true });
  });

  it("emits when isOpenToday flips from true to false", async () => {
    givenPlaces([buildPlace(10, true)]); // true -> false : changed
    mockedIsPlaceOpenToday.mockResolvedValue(false);

    await setIsOpenToday();

    expect(mockedSendToQueue).toHaveBeenCalledTimes(1);
    const [, , payload] = mockedSendToQueue.mock.calls[0];
    expect(payload).toEqual({ placeId: 10, isOpenToday: false });
  });

  it("does not emit any event when no place-level value changed", async () => {
    givenPlaces([buildPlace(20, true), buildPlace(21, false)]);
    mockedIsPlaceOpenToday.mockImplementation((place: { lieu_id: number }) =>
      Promise.resolve(place.lieu_id === 20)
    );

    await setIsOpenToday();

    expect(mockedSendToQueue).not.toHaveBeenCalled();
  });

  it("still persists the computed status to MongoDB for every place", async () => {
    givenPlaces([buildPlace(30, false)]);
    mockedIsPlaceOpenToday.mockResolvedValue(false); // unchanged, no emit

    await setIsOpenToday();

    expect(mockedPlaceModel.bulkWrite).toHaveBeenCalled();
    expect(mockedSendToQueue).not.toHaveBeenCalled();
  });
});
