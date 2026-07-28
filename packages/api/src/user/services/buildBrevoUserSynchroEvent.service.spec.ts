import type { AmqpSynchroUserEvent } from "../../events";
// jest.spyOn requires the module namespace object (a named import cannot be spied on)
// skipcq: JS-C1003
import * as placeService from "../../place/services/place.service";
import { buildBrevoUserSynchroEvent } from "./buildBrevoUserSynchroEvent.service";

const baseEventWithRights = (
  rights: Array<{ place_id?: number | null; status: string }>
): AmqpSynchroUserEvent =>
  ({ email: "ada@example.org", rights } as unknown as AmqpSynchroUserEvent);

describe("buildBrevoUserSynchroEvent", () => {
  let findActiveLieuIdsSpy: jest.SpyInstance;

  beforeEach(() => {
    findActiveLieuIdsSpy = jest
      .spyOn(placeService, "findActiveLieuIds")
      .mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets placesCount from the active places of the user's VERIFIED rights", async () => {
    findActiveLieuIdsSpy.mockResolvedValue([10, 20]);
    const baseEvent = baseEventWithRights([
      { place_id: 10, status: "VERIFIED" },
      { place_id: 20, status: "VERIFIED" },
      { place_id: 30, status: "PENDING" },
    ]);

    const brevoEvent = await buildBrevoUserSynchroEvent(baseEvent);

    expect(findActiveLieuIdsSpy).toHaveBeenCalledWith([10, 20]);
    expect(brevoEvent.placesCount).toBe(2);
  });

  it("sets placesCount to 0 when the user has no VERIFIED place right", async () => {
    const baseEvent = baseEventWithRights([{ place_id: 5, status: "PENDING" }]);

    const brevoEvent = await buildBrevoUserSynchroEvent(baseEvent);

    expect(findActiveLieuIdsSpy).toHaveBeenCalledWith([]);
    expect(brevoEvent.placesCount).toBe(0);
  });

  it("skips the count for a deleted user", async () => {
    const baseEvent = baseEventWithRights([
      { place_id: 10, status: "VERIFIED" },
    ]);

    const brevoEvent = await buildBrevoUserSynchroEvent(baseEvent, {
      isDeleted: true,
    });

    expect(findActiveLieuIdsSpy).not.toHaveBeenCalled();
    expect(brevoEvent.placesCount).toBeUndefined();
  });

  it("does not mutate the base event so the Airtable payload stays without placesCount", async () => {
    findActiveLieuIdsSpy.mockResolvedValue([10]);
    const baseEvent = baseEventWithRights([
      { place_id: 10, status: "VERIFIED" },
    ]);

    await buildBrevoUserSynchroEvent(baseEvent);

    expect(
      (baseEvent as AmqpSynchroUserEvent & { placesCount?: number }).placesCount
    ).toBeUndefined();
  });
});
