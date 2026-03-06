
import { PlaceOpeningStatus } from "../enums";
import { PlaceClosedHolidays } from "../../hours";
import { ONLINE_PLACE } from "../mocks";
import { computePlaceOpeningStatus } from "./computePlaceOpeningStatus";

describe("Check if the opening status is well determined", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-10-28"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should return 'open' if the place is online and open today", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: true,
    };
    expect(computePlaceOpeningStatus(place)).toEqual(PlaceOpeningStatus.OPEN);
  });

  it("Should return 'open' if the place is online and open today with a temporary closure starting in 3 days", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: true,
      tempInfos: {
        ...ONLINE_PLACE.tempInfos,
        closure: {
          actif: true,
          dateDebut: "2024-11-01T00:00:00.000Z",
          dateFin: "2024-11-30T23:59:59.000Z",
        },
      },
    };

    expect(computePlaceOpeningStatus(place)).toEqual(PlaceOpeningStatus.OPEN);
  });

  it("Should return 'closed' if the place is online and closed today with a temporary closure starting in 3 days", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      tempInfos: {
        ...ONLINE_PLACE.tempInfos,
        closure: {
          actif: true,
          dateDebut: "2024-11-01T00:00:00.000Z",
          dateFin: "2024-11-30T23:59:59.000Z",
        },
      },
    };

    expect(computePlaceOpeningStatus(place)).toEqual(PlaceOpeningStatus.CLOSED);
  });

  it("Should return 'partiallyOpen' if place is closed with at least 1 opening day in the week and at least 1 service that his open today", () => {
    const serviceOpenToday = {
      ...ONLINE_PLACE.services_all[0],
      isOpenToday: true,
    };

    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      services_all: [serviceOpenToday],
    };

    expect(computePlaceOpeningStatus(place)).toEqual(
      PlaceOpeningStatus.PARTIALLY_OPEN
    );
  });

  it("Should return 'closed' if the place is online, closed today with at least 1 day that has defined times", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
    };
    expect(computePlaceOpeningStatus(place)).toEqual(PlaceOpeningStatus.CLOSED);
  });

  it("Should return 'unknown' if the place is online without hours defined", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      newhours: {
        description: "Description des horaires",
        closedHolidays: PlaceClosedHolidays.CLOSED,
        friday: {
          open: false,
          timeslot: [],
        },
        monday: {
          open: false,
          timeslot: [],
        },
        saturday: {
          open: false,
          timeslot: [],
        },
        sunday: {
          open: false,
          timeslot: [],
        },
        thursday: {
          open: false,
          timeslot: [],
        },
        tuesday: {
          open: false,
          timeslot: [],
        },
        wednesday: {
          open: false,
          timeslot: [],
        },
      },
    };
    expect(computePlaceOpeningStatus(place)).toEqual(
      PlaceOpeningStatus.UNKNOWN
    );
  });
});

describe("Check tempInfos closure", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-10-28"));
  });

  it("Should return 'temporarilyClosed' if place is closed today with an effective temporary closure", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      tempInfos: {
        ...ONLINE_PLACE.tempInfos,
        closure: {
          actif: true,
          dateDebut: "2024-04-01T00:00:00.000Z",
          dateFin: "2024-11-30T23:59:59.000Z",
        },
      },
    };

    expect(computePlaceOpeningStatus(place)).toEqual(
      PlaceOpeningStatus.TEMPORARILY_CLOSED
    );
  });

  it("Should return 'temporarilyClosed' if we have a dateDebut effective and a dateFin undefined", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      tempInfos: {
        ...ONLINE_PLACE.tempInfos,
        closure: {
          actif: true,
          dateDebut: "2024-04-01T00:00:00.000Z",
          dateFin: null,
        },
      },
    };
    expect(computePlaceOpeningStatus(place)).toEqual(
      PlaceOpeningStatus.TEMPORARILY_CLOSED
    );
  });

  it("Should return 'unknown' if we have a tempClosure dateFin defined with a dateDebut undefined, and is closed today without hours defined at all", () => {
    const place = {
      ...ONLINE_PLACE,
      isOpenToday: false,
      tempInfos: {
        ...ONLINE_PLACE.tempInfos,
        closure: {
          actif: true,
          dateDebut: null,
          dateFin: "2024-04-01T00:00:00.000Z",
        },
      },
      newhours: {
        description: "Description des horaires",
        closedHolidays: PlaceClosedHolidays.CLOSED,
        friday: {
          open: false,
          timeslot: [],
        },
        monday: {
          open: false,
          timeslot: [],
        },
        saturday: {
          open: false,
          timeslot: [],
        },
        sunday: {
          open: false,
          timeslot: [],
        },
        thursday: {
          open: false,
          timeslot: [],
        },
        tuesday: {
          open: false,
          timeslot: [],
        },
        wednesday: {
          open: false,
          timeslot: [],
        },
      },
    };
    expect(computePlaceOpeningStatus(place)).toEqual(
      PlaceOpeningStatus.UNKNOWN
    );
  });
});
