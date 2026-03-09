import { CommonDayOpeningHours, CommonOpeningHours } from "../classes";
import { OpeningHoursContext, PlaceClosedHolidays } from "../enums";

describe("Should create CommonDayOpeningHours", () => {
  it("Should create empty CommonDayOpeningHours", () => {
    const test = new CommonDayOpeningHours();
    expect(test).toEqual({
      open: false,
      timeslot: [],
    });
  });
});

describe("Should create Common Hours interfaces", () => {
  it("Should create empty common hours", () => {
    const test = new CommonOpeningHours();
    expect(test).toEqual({
      closedHolidays: PlaceClosedHolidays.UNKNOWN,
      description: "",
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
    });
  });

  it("Should create common hours with values", () => {
    const test = new CommonOpeningHours(
      {
        description: "This a description",
        friday: {
          open: true,
          timeslot: [{ end: 1000, start: 10 }],
        },
      },
      OpeningHoursContext.API
    );

    expect(test).toEqual({
      closedHolidays: PlaceClosedHolidays.UNKNOWN,
      description: "This a description",
      friday: {
        open: true,
        timeslot: [{ end: 1000, start: 10 }],
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
    });
  });
  it("Should sort timeslots", () => {
    const test = new CommonOpeningHours(
      {
        monday: {
          open: true,
          timeslot: [
            { start: "14:00", end: "17:00" },
            { start: "05:00", end: "07:00" },
            { start: "08:00", end: "12:00" },
          ],
        },
      },
      OpeningHoursContext.API
    );
    expect(test).toEqual({
      closedHolidays: PlaceClosedHolidays.UNKNOWN,
      description: "",
      friday: {
        open: false,
        timeslot: [],
      },
      monday: {
        open: true,
        timeslot: [
          { start: 500, end: 700 },
          { start: 800, end: 1200 },
          { start: 1400, end: 1700 },
        ],
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
    });
  });

  it("should get timeslot starting at 0", () => {
    const test = new CommonDayOpeningHours({
      timeslot: [
        { start: 0, end: 800 },
        { start: 1400, end: 1800 },
      ],
    });

    expect(test).toEqual({
      open: true,
      timeslot: [
        { start: 0, end: 800 },
        { start: 1400, end: 1800 },
      ],
    });
  });
});
