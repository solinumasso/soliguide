import { ONLINE_PLACE } from "../mocks";
import { computeTempIsActive } from "./computeTempIsActive";

describe("computeTempIsActive", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return false when temporary period is not active", () => {
    const inactivePlace = {
      ...ONLINE_PLACE,
      tempInfos: {
        hours: { ...ONLINE_PLACE.tempInfos.hours, actif: false },
      },
    };
    expect(computeTempIsActive(inactivePlace.tempInfos.hours)).toBe(false);
  });

  it("should return true when hours tempInfos date is active", () => {
    jest.setSystemTime(new Date("2024-06-15"));
    const activePlace = {
      ...ONLINE_PLACE,
      tempInfos: {
        hours: {
          ...ONLINE_PLACE.tempInfos.hours,
          actif: true,
          dateDebut: new Date("2024-06-01"),
          dateFin: new Date("2024-06-30"),
        },
      },
    };
    expect(computeTempIsActive(activePlace.tempInfos.hours)).toBe(true);
  });

  it("should return true when closure tempInfos date is active", () => {
    jest.setSystemTime(new Date("2024-06-15"));
    const activePlace = {
      ...ONLINE_PLACE,
      tempInfos: {
        closure: {
          ...ONLINE_PLACE.tempInfos.closure,
          actif: true,
          dateDebut: new Date("2024-06-01"),
          dateFin: new Date("2024-06-30"),
        },
      },
    };
    expect(computeTempIsActive(activePlace.tempInfos.closure)).toBe(true);
  });

  it("should return false when current date is before start date", () => {
    jest.setSystemTime(new Date("2023-12-31"));
    const inactivePlace = {
      ...ONLINE_PLACE,
      tempInfos: {
        closure: {
          ...ONLINE_PLACE.tempInfos.closure,
          actif: true,
          dateDebut: new Date("2025-06-01"),
          dateFin: null,
        },
      },
    };
    expect(computeTempIsActive(inactivePlace.tempInfos.closure)).toBe(false);
  });

  it("should return false when current date is after tempInfos closure end date", () => {
    jest.setSystemTime(new Date("2026-01-01"));
    const inactivePlace = {
      ...ONLINE_PLACE,
      tempInfos: {
        closure: {
          ...ONLINE_PLACE.tempInfos.closure,
          actif: true,
          dateDebut: new Date("2025-06-01"),
          dateFin: new Date("2025-08-01"),
        },
      },
    };

    expect(computeTempIsActive(inactivePlace.tempInfos.closure)).toBe(false);
  });

  it("should return true when current date is after tempInfo hours start date and when no end date is null", () => {
    jest.setSystemTime(new Date("2025-01-01"));
    const placeWithoutEndDate = {
      ...ONLINE_PLACE,
      tempInfos: {
        hours: {
          actif: true,
          ...ONLINE_PLACE.tempInfos.hours,
          dateDebut: new Date("2024-01-01"),
          dateFin: null,
        },
      },
    };

    expect(computeTempIsActive(placeWithoutEndDate.tempInfos.hours)).toBe(true);
  });
});
