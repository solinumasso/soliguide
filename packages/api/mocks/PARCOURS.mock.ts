import { CommonPlaceParcours } from "@soliguide/common";
import { CountryCodes } from "@soliguide/common";

export const PARCOURS: CommonPlaceParcours[] = [
  {
    description: "Un faux point de passage",
    hours: {
      description: null,
      friday: {
        open: false,
        timeslot: [],
      },
      monday: {
        open: true,
        timeslot: [{ end: 1915, start: 1900 }],
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
        open: true,
        timeslot: [{ end: 1915, start: 1900 }],
      },
    },
    photos: [],
    position: {
      adresse: "24 Rue Daubenton, 75005 Paris, France",
      address: "24 Rue Daubenton, 75005 Paris, France",
      codePostal: "75005",
      cityCode: "75115",
      postalCode: "75005",
      complementAdresse: null,
      departement: "Paris",
      department: "Paris",
      location: {
        coordinates: [2.35344740000005, 48.8413974],
        type: "Point",
      },
      departementCode: "75",
      departmentCode: "75",
      pays: CountryCodes.FR,
      country: CountryCodes.FR,
      region: "Île-de-France",
      regionCode: "11",
      ville: "Paris",
      city: "Paris",
      timeZone: "Europe/Paris",
    },
  },
  {
    description: "Un deuxième faux point de passage",
    hours: {
      description: null,
      friday: {
        open: false,
        timeslot: [],
      },
      monday: {
        open: true,
        timeslot: [{ end: 1930, start: 1915 }],
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
        open: true,
        timeslot: [{ end: 1930, start: 1915 }],
      },
    },
    photos: [],
    position: {
      address: "24 Rue Daubenton, 75005 Paris, France",
      adresse: "24 Rue Daubenton, 75005 Paris, France",
      codePostal: "75005",
      cityCode: "75115",
      postalCode: "75005",
      complementAdresse: null,
      departement: "Paris",
      department: "Paris",
      location: {
        coordinates: [2.35344740000005, 48.8413974],
        type: "Point",
      },
      departementCode: "75",
      departmentCode: "75",
      pays: CountryCodes.FR,
      country: CountryCodes.FR,
      region: "Île-de-France",
      regionCode: "11",
      ville: "Paris",
      city: "Paris",
      timeZone: "Europe/Paris",
    },
  },
];
