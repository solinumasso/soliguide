import { CommonOpeningHours } from "../classes/CommonOpeningHours.class";
import { is24HoursOpen, isOneDayOpen } from "./placeHours.function";

describe("isOneDayOpen", () => {
  it("should return false if all days are closed", () => {
    const closedHours = new CommonOpeningHours();
    expect(isOneDayOpen(closedHours)).toBe(false);
  });

  it("should return true if at least one day is open", () => {
    const openMonday = new CommonOpeningHours({
      monday: {
        open: true,
        timeslot: [{ start: 900, end: 1200 }],
      },
    });
    expect(isOneDayOpen(openMonday)).toBe(true);
  });

  it("should return false if hours is undefined", () => {
    expect(isOneDayOpen(undefined)).toBe(false);
  });
});

describe("is24HoursOpen", () => {
  const fullDaySlot = { start: 0, end: 2359 };
  const shortDaySlot = { start: 1000, end: 1800 };

  it("should return false if hours is not gived as a parameter", () => {
    expect(is24HoursOpen()).toBe(false);
  });

  it("should return true if all days have 00:00 to 23:59 slot", () => {
    const fullWeek = new CommonOpeningHours({
      monday: { open: true, timeslot: [fullDaySlot] },
      tuesday: { open: true, timeslot: [fullDaySlot] },
      wednesday: { open: true, timeslot: [fullDaySlot] },
      thursday: { open: true, timeslot: [fullDaySlot] },
      friday: { open: true, timeslot: [fullDaySlot] },
      saturday: { open: true, timeslot: [fullDaySlot] },
      sunday: { open: true, timeslot: [fullDaySlot] },
    });

    expect(is24HoursOpen(fullWeek)).toBe(true);
  });

  it("should return false if one day does not have full slot", () => {
    const almostFullWeek = new CommonOpeningHours({
      monday: { open: true, timeslot: [fullDaySlot] },
      tuesday: { open: true, timeslot: [fullDaySlot] },
      wednesday: { open: true, timeslot: [fullDaySlot] },
      thursday: { open: true, timeslot: [fullDaySlot] },
      friday: { open: true, timeslot: [shortDaySlot] },
      saturday: { open: true, timeslot: [fullDaySlot] },
      sunday: { open: true, timeslot: [fullDaySlot] },
    });

    expect(is24HoursOpen(almostFullWeek)).toBe(false);
  });

  it("should return false if hours is null", () => {
    expect(is24HoursOpen(null)).toBe(false);
  });
});
