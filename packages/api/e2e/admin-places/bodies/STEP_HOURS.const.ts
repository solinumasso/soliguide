import { PlaceClosedHolidays } from "@soliguide/common";

export const HOURS_OK = {
  newhours: {
    closedHolidays: PlaceClosedHolidays.UNKNOWN,
    description: "Les horaires sont sympas",
    friday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "08:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
    h24: false,
    monday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "08:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
    saturday: { open: false, show: false, timeslot: [] },
    sunday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "09:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
    thursday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "08:00" },
        { end: "05:00", start: "23:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
    tuesday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "08:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
    wednesday: {
      open: true,
      show: false,
      timeslot: [
        { end: "12:30", start: "08:00" },
        { end: "16:30", start: "14:00" },
      ],
    },
  },
};
