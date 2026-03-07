import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  ApiPlace,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  PublicsFamily,
  ServiceSaturation,
  WelcomedPublics,
  CountryCodes,
  PlaceClosedHolidays,
  Categories,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { Types } from "mongoose";

export const MCP_PLACE: ApiPlace = {
  parcours: [],
  isOpenToday: false,
  organizations: [],
  createdBy: null,
  auto: false,
  _id: "5a58c0c7c1797fe45e37740d",
  createdAt: "2018-01-12T14:05:59.000Z",
  description:
    "Les centres de PMI (Protection maternelle et infantile) vous accueillent pour toutes les d&#233;marches concernant la sant&#233; de votre enfant. Ouverts &#224; tous et gratuits, ils proposent des consultations m&#233;dicales pr&#233;ventives pour les nourrissons et les jeunes enfants de la naissance &#224; 6 ans. Les pu&#233;ricultrices de PMI vous conseillent et vous accompagnent au quotidien. Des ateliers pour le soutien &#224; l'allaitement sont organis&#233;s, de m&#234;me que des s&#233;ances d'&#233;veil du tout-petit et des r&#233;unions de groupes de parents anim&#233;es par des &#233;quipes pluridisciplinaires (pu&#233;ricultrices, auxiliaires de pu&#233;riculture, psychologues, psychomotriciens, sages-femmes). Des visites &#224; domicile par des pu&#233;ricultrices de PMI peuvent vous &#234;tre propos&#233;es.",
  entity: {
    facebook: "",
    fax: "",
    mail: "",
    phones: [
      {
        label: "Accueil",
        phoneNumber: "0155269455",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
    website: "https://www.paris.fr/equipements/centre-de-pmi-aqueduc-6445",
  },
  sourceLanguage: SupportedLanguagesCode.FR,
  country: CountryCodes.FR,
  languages: ["fr"],
  lieu_id: 387,
  modalities: {
    animal: {
      checked: false,
    },
    appointment: {
      checked: false,
      precisions: "Précisions du rendez-vous",
    },
    docs: [],
    inconditionnel: true,
    inscription: {
      checked: false,
      precisions: null,
    },
    orientation: {
      checked: true,
      precisions: "orientation precisions",
    },
    other: "other precisions",
    pmr: {
      checked: false,
    },
    price: {
      checked: false,
      precisions: null,
    },
  },
  name: "PMI Aqueduc",
  newhours: {
    closedHolidays: PlaceClosedHolidays.OPEN,
    description: "",
    friday: {
      open: true,
      timeslot: [
        {
          end: 1230,
          start: 830,
        },
        {
          end: 1730,
          start: 1330,
        },
      ],
    },
    monday: {
      open: true,
      timeslot: [
        {
          end: 1230,
          start: 830,
        },
        {
          end: 1730,
          start: 1330,
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
          end: 1230,
          start: 830,
        },
        {
          end: 1730,
          start: 1330,
        },
      ],
    },
    tuesday: {
      open: true,
      timeslot: [
        {
          end: 1230,
          start: 830,
        },
        {
          end: 1730,
          start: 1330,
        },
      ],
    },
    wednesday: {
      open: true,
      timeslot: [
        {
          end: 1230,
          start: 830,
        },
        {
          end: 1730,
          start: 1330,
        },
      ],
    },
  },
  photos: [],
  placeType: PlaceType.PLACE,
  position: {
    adresse: "55 Rue de l'Aqueduc, 75010 Paris, France",
    address: "55 Rue de l'Aqueduc, 75010 Paris, France",
    codePostal: "75010",
    postalCode: "75010",
    cityCode: "75110",
    city: "Paris",
    complementAdresse: null,
    departement: "Paris",
    department: "Paris",
    departementCode: "75",
    departmentCode: "75",
    location: {
      coordinates: [2.3654295, 48.8834066],
      type: "Point",
    },
    pays: "France",
    country: CountryCodes.FR,
    region: "Île-de-France",
    regionCode: "11",
    slugs: {
      departement: "paris",
      pays: "france",
      region: "ile-de-france",
      ville: "paris",
    },
    ville: "Paris",
    timeZone: "Europe/Paris",
  },
  priority: false,
  publics: {
    accueil: WelcomedPublics.PREFERENTIAL,
    administrative: ADMINISTRATIVE_DEFAULT_VALUES,
    age: {
      max: 99,
      min: 0,
    },
    description: "publics description",
    familialle: [
      PublicsFamily.family,
      PublicsFamily.couple,
      PublicsFamily.pregnant,
    ],
    gender: GENDER_DEFAULT_VALUES,
    other: [],
  },
  seo_url: "pmi-aqueduc-paris-387",
  services_all: [
    {
      category: Categories.PREGNANCY_CARE,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null,
      },
      description: "Permanences sages-femmes sur rendez vous",
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
          open: false,
          timeslot: [],
        },
        saturday: {
          open: true,
          timeslot: [
            {
              end: 1200,
              start: 900,
            },
          ],
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
      modalities: {
        animal: {
          checked: false,
        },
        appointment: {
          checked: false,
          precisions: "Permanences sages",
        },
        docs: [],
        inconditionnel: true,
        inscription: {
          checked: false,
          precisions: "Précisions de l'inscription",
        },
        orientation: {
          checked: false,
          precisions: null,
        },
        other: null,
        pmr: {
          checked: false,
        },
        price: {
          checked: false,
          precisions: null,
        },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: {
          max: 99,
          min: 0,
        },
        description: "Test Description",
        familialle: [
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW,
      },
      createdAt: new Date(),
      isOpenToday: true,
      serviceObjectId: new Types.ObjectId(),
    },
    {
      category: Categories.PREGNANCY_CARE,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null,
      },
      description:
        "Préparation à la naissance sur rendez vous (06 74 74 79 60)",
      differentHours: true,
      differentModalities: true,
      differentPublics: true,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "different",
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
          open: true,
          timeslot: [
            {
              end: 1700,
              start: 1400,
            },
          ],
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
          precisions: "different",
        },
        docs: [],
        inconditionnel: true,
        inscription: {
          checked: true,
          precisions: "different",
        },
        orientation: {
          checked: true,
          precisions: "different",
        },
        other: "different",
        pmr: {
          checked: false,
        },
        price: {
          checked: false,
          precisions: "different",
        },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: {
          max: 99,
          min: 0,
        },
        description: "different",
        familialle: [
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW,
      },
      createdAt: new Date(),
      isOpenToday: true,
      serviceObjectId: new Types.ObjectId(),
    },
    {
      category: Categories.CHILD_CARE,
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
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        monday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
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
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
      },
      modalities: {
        animal: {
          checked: false,
        },
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
        pmr: {
          checked: false,
        },
        price: {
          checked: false,
          precisions: null,
        },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: {
          max: 99,
          min: 0,
        },
        description: null,
        familialle: [
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW,
      },
      createdAt: new Date(),
      isOpenToday: true,
      serviceObjectId: new Types.ObjectId(),
    },

    {
      category: Categories.PREGNANCY_CARE,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null,
      },
      description: "Entretien prénatal du 4ème mois sur rendez vous",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: "",
        friday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        monday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
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
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 1230,
              start: 830,
            },
            {
              end: 1730,
              start: 1330,
            },
          ],
        },
      },
      modalities: {
        animal: {
          checked: false,
        },
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
        pmr: {
          checked: false,
        },
        price: {
          checked: false,
          precisions: null,
        },
      },
      publics: {
        accueil: WelcomedPublics.PREFERENTIAL,
        administrative: ADMINISTRATIVE_DEFAULT_VALUES,
        age: {
          max: 99,
          min: 0,
        },
        description: null,
        familialle: [
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: GENDER_DEFAULT_VALUES,
        other: [],
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW,
      },
      createdAt: new Date(),
      isOpenToday: true,
      serviceObjectId: new Types.ObjectId(),
    },
  ],
  slugs: {
    infos: {
      description:
        "les centres de pmi protection maternelle et infantile  vous accueillent pour toutes les d marches concernant la sant  de votre enfant  ouverts   tous et gratuits  ils proposent des consultations m dicales pr ventives pour les nourrissons et les jeunes enfants de la naissance   6 ans  les pu ricultrices de pmi vous conseillent et vous accompagnent au quotidien  des ateliers pour le soutien   l allaitement sont organis s  de m me que des s ances d  veil du tout petit et des r unions de groupes de parents anim es par des  quipes pluridisciplinaires  pu ricultrices  auxiliaires de pu riculture  psychologues  psychomotriciens  sages femmes   des visites   domicile par des pu ricultrices de pmi peuvent vous  tre propos es",
      name: "pmi aqueduc",
    },
  },
  status: PlaceStatus.ONLINE,
  stepsDone: {
    conditions: true,
    horaires: true,
    infos: true,
    photos: true,
    contacts: true,
    publics: true,
    services: true,
    emplacement: true,
  },
  tempInfos: {
    closure: {
      actif: false,
      dateDebut: "2021-07-12T00:00:00.000Z",
      dateFin: "2021-08-27T00:00:00.000Z",
      description: "Vacances",
    },
    hours: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      value: null,
    },
    message: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      name: null,
    },
  },
  updatedByUserAt: "2021-06-22T07:59:49.934Z",
  updatedAt: "2021-06-22T07:59:49.934Z",
  visibility: PlaceVisibility.ALL,
};
