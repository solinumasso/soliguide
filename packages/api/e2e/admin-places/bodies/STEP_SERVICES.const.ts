import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  ApiPlace,
  Categories,
  GENDER_DEFAULT_VALUES,
  PlaceClosedHolidays,
  PublicsFamily,
  ServiceSaturation,
  WelcomedPublics,
} from "@soliguide/common";

export const STEP_SERVICES_OK: Partial<ApiPlace> = {
  services_all: [
    {
      category: Categories.DAY_HOSTING,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "Accueil inconditionnel, boissons chaudes",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      isOpenToday: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "",
        friday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        monday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        saturday: { open: false, timeslot: [] },
        sunday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "09:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        thursday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
      },
      modalities: {
        animal: { checked: false },
        appointment: { checked: false, precisions: null },
        docs: [],
        inconditionnel: false,
        inscription: { checked: false, precisions: null },
        orientation: { checked: true, precisions: null },
        other: null,
        pmr: { checked: false },
        price: { checked: false, precisions: null },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: { max: 99, min: 18 },
        description: "",
        familialle: [PublicsFamily.isolated, PublicsFamily.couple],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: { precision: "", status: ServiceSaturation.LOW },
      serviceObjectId: "6181a6d08ac6b179ffb9fcb1",
      createdAt: new Date(),
    },
    {
      category: Categories.FOUNTAIN,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "",
        friday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        monday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        saturday: { open: false, timeslot: [] },
        sunday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "09:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        thursday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
      },
      modalities: {
        animal: { checked: false },
        appointment: { checked: false, precisions: null },
        docs: [],
        inconditionnel: false,
        inscription: { checked: false, precisions: null },
        orientation: { checked: true, precisions: null },
        other: null,
        pmr: { checked: false },
        price: { checked: false, precisions: null },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: { max: 99, min: 18 },
        description: null,
        familialle: [PublicsFamily.isolated, PublicsFamily.couple],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: { precision: "", status: ServiceSaturation.LOW },
      serviceObjectId: "6181a6d08ac6b179ffb9fcb0",
      createdAt: new Date(),
      isOpenToday: false,
    },
    {
      category: Categories.SHOWER,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "",
      differentHours: true,
      differentModalities: true,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "",
        friday: {
          open: true,
          timeslot: [{ end: "11:30", start: "09:00" }],
        },
        monday: {
          open: true,
          timeslot: [{ end: "11:30", start: "09:00" }],
        },
        saturday: { open: false, timeslot: [] },
        sunday: { open: false, timeslot: [] },
        thursday: {
          open: true,
          timeslot: [{ end: "11:30", start: "09:00" }],
        },
        tuesday: {
          open: true,
          timeslot: [{ end: "11:30", start: "09:00" }],
        },
        wednesday: {
          open: true,
          timeslot: [{ end: "11:30", start: "09:00" }],
        },
      },
      modalities: {
        animal: { checked: false },
        appointment: { checked: false, precisions: null },
        docs: [],
        inconditionnel: false,
        inscription: {
          checked: true,
          precisions: "Le matin-même",
        },
        orientation: { checked: false, precisions: null },
        other: null,
        pmr: { checked: false },
        price: { checked: false, precisions: null },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: { max: 99, min: 18 },
        description: null,
        familialle: [PublicsFamily.isolated, PublicsFamily.couple],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: { precision: "", status: ServiceSaturation.LOW },
      serviceObjectId: "6181a6d08ac6b179ffb9fcb2",
      createdAt: new Date(),
      isOpenToday: false,
    },
    {
      category: Categories.TOILETS,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "",
        friday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        monday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        saturday: { open: false, timeslot: [] },
        sunday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "09:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        thursday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            { end: "12:30", start: "08:00" },
            { end: "16:30", start: "14:00" },
          ],
        },
      },
      modalities: {
        animal: { checked: false },
        appointment: { checked: false, precisions: null },
        docs: [],
        inconditionnel: false,
        inscription: { checked: false, precisions: null },
        orientation: { checked: true, precisions: null },
        other: null,
        pmr: { checked: false },
        price: { checked: false, precisions: null },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: { max: 99, min: 18 },
        description: null,
        familialle: [PublicsFamily.isolated, PublicsFamily.couple],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: { precision: "", status: ServiceSaturation.LOW },
      serviceObjectId: "6181a6d08ac6b179ffb9fcb3",
      createdAt: new Date(),
      isOpenToday: false,
    },
  ],
};
