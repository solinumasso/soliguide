import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  Categories,
  CommonNewPlaceService,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PlaceClosedHolidays,
  ServiceSaturation,
  WelcomedPublics,
} from "@soliguide/common";

export const SERVICE_SOCIAL_SUPPORT = {
  category: Categories.SOCIAL_ACCOMPANIMENT,
  close: {
    actif: false,
    dateDebut: "2021-07-14T00:00:00.000Z",
    dateFin: "2021-09-06T00:00:00.000Z",
  },
  description: "De préférence sur rendez-vous.",
  differentHours: false,
  differentModalities: false,
  differentPublics: false,
  hours: {
    description: null,
    friday: {
      open: false,
      timeslot: [],
    },
    monday: {
      open: true,
      timeslot: [
        {
          end: 1200,
          start: 930,
        },
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
      open: true,
      timeslot: [
        {
          end: 1200,
          start: 930,
        },
      ],
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
  modalities: {
    animal: {
      checked: false,
    },
    appointment: {
      checked: true,
      precisions: null,
    },
    docs: [],
    inconditionnel: false,
    inscription: {
      checked: false,
      precisions: null,
    },
    orientation: {
      checked: false,
      precisions: "Orientation précision FR",
    },
    other:
      "Personnes domiciliées dans les 5e, 6e, 7e, 14e, 15e et 16e arrondissements. ",
    pmr: {
      checked: false,
    },
    price: {
      checked: false,
      precisions: null,
    },
  },
  publics: {
    accueil: WelcomedPublics.UNCONDITIONAL,
    administrative: ADMINISTRATIVE_DEFAULT_VALUES,
    age: { max: 99, min: 0 },
    description: null,
    familialle: FAMILY_DEFAULT_VALUES,
    gender: GENDER_DEFAULT_VALUES,
    other: OTHER_DEFAULT_VALUES,
  },
  saturated: {
    precision: null,
    status: ServiceSaturation.LOW,
  },
  serviceObjectId: "6181a6d18ac6b179ffb9fcea",
  createdAt: new Date(),
};

export const SERVICE_FOOD_DISTRIBUTION: CommonNewPlaceService = {
  category: Categories.FOOD_DISTRIBUTION,
  close: {
    actif: false,
    dateDebut: null,
    dateFin: null,
  },
  description: "",
  differentHours: false,
  differentModalities: false,
  differentPublics: false,
  hours: {
    closedHolidays: PlaceClosedHolidays.UNKNOWN,
    description: "",
    friday: {
      open: false,
      timeslot: [],
    },
    monday: {
      open: true,
      timeslot: [
        {
          end: 2000,
          start: 1900,
        },
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
      open: true,
      timeslot: [
        {
          end: 2000,
          start: 1900,
        },
      ],
    },
  },
  modalities: {
    animal: { checked: true },
    appointment: {
      checked: false,
      precisions: null,
    },
    docs: [],
    inconditionnel: true,
    inscription: {
      checked: false,
      precisions: null,
    },
    orientation: {
      checked: false,
      precisions: null,
    },
    other: null,
    pmr: { checked: false },
    price: {
      checked: false,
      precisions: null,
    },
  },
  publics: {
    accueil: WelcomedPublics.UNCONDITIONAL,
    administrative: ADMINISTRATIVE_DEFAULT_VALUES,
    age: { max: 99, min: 0 },
    description: null,
    familialle: FAMILY_DEFAULT_VALUES,
    gender: GENDER_DEFAULT_VALUES,
    other: OTHER_DEFAULT_VALUES,
  },
  saturated: {
    precision: null,
    status: ServiceSaturation.LOW,
  },
  isOpenToday: true,
  serviceObjectId: "624aeecfe00b2d30832fe753",
  createdAt: new Date(),
};
