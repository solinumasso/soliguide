import { CountryCodes, PlaceClosedHolidays } from "@soliguide/common";

export const STEP_PARCOURS_OK = {
  "0": {
    photos: [],
    description: "La description de test",
    hours: {
      closedHolidays: PlaceClosedHolidays.UNKNOWN,
      isOpeningHoursSet: true,
      description: "Les horaires sont sympas",
      h24: false,
      friday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "08:00",
          },
        ],
      },
      monday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "08:00",
          },
        ],
      },
      saturday: {
        open: false,
        show: false,
        timeslot: [],
      },
      sunday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "09:00",
          },
        ],
      },
      thursday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "08:00",
          },
        ],
      },
      tuesday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "08:00",
          },
        ],
      },
      wednesday: {
        open: true,
        show: false,
        timeslot: [
          {
            end: "12:30",
            start: "08:00",
          },
        ],
      },
    },
    position: {
      address: "27 Rue Saint-Martin, 75004 Paris, France",
      additionalInformation: "Au coin du feu",
      country: CountryCodes.FR,
      city: "Paris",
      postalCode: "75004",
      cityCode: null,
      department: "Paris",
      regionCode: "11",
      departmentCode: "75",
      region: "Île-de-France",
      timeZone: "Europe/Paris",
      location: {
        type: "Point",
        coordinates: [2.3499646, 48.85899020000001],
      },
    },
  },
};
