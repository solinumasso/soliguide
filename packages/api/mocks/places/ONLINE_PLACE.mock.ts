import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  WelcomedPublics,
  CountryCodes,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { SERVICE_SOCIAL_SUPPORT } from "../SERVICE.mock";

export const ONLINE_PLACE: any = {
  auto: false,
  organizations: [],
  createdBy: "",
  parcours: [],
  isOpenToday: true,
  _id: "5a58c0c7c1797fe45e3772ab",
  country: CountryCodes.FR,
  sourceLanguage: SupportedLanguagesCode.FR,
  createdAt: new Date("2018-01-12T14:05:59.000Z"),
  description:
    "Accueil &#233;coute et accompagnement social : carte alimentaire et bon vestiaire. Permanence logement (aide aux d&#233;marches, conseil, orientation). Les permanences sont dor&#233;navant sur rendez-vous par t&#233;l&#233;phone ou sur place aux heures de permanence.",
  entity: {
    facebook: "",
    fax: "",
    mail: "antenne14@structure-en-ligne.org",
    phones: [
      {
        label: "Accueil",
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
    website: "https://www.structure-en-ligne.org/",
  },
  languages: ["fr"],
  lieu_id: 33,
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
      precisions: null,
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
  name: "Antenne Marcel Paul - Secours Populaire Français",
  newhours: {
    description: "Description des horaires",
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
  photos: [],
  placeType: PlaceType.PLACE,
  position: {
    adresse: "11 bis boulevard de l'Hôpital, 75013 Paris", // @deprecated
    address: "11 bis boulevard de l'Hôpital, 75013 Paris",
    postalCode: "75013",
    codePostal: "75013", // @deprecated
    cityCode: "75013",
    complementAdresse: "",
    department: "Paris",
    departement: "Paris", // @deprecated
    departmentCode: "75",
    departementCode: "75", // @deprecated
    location: {
      coordinates: [2.3631959, 48.8418381],
      type: "Point",
    },
    country: CountryCodes.FR,
    pays: CountryCodes.FR, // @deprecated
    region: "Île-de-France",
    regionCode: "11",
    slugs: {
      departement: "paris",
      pays: "france",
      region: "ile-de-france",
      ville: "paris",
    },
    city: "Paris",
    ville: "Paris", // @deprecated
    timeZone: "Europe/Paris",
  },
  priority: false,
  publics: {
    accueil: WelcomedPublics.UNCONDITIONAL,
    administrative: ADMINISTRATIVE_DEFAULT_VALUES,
    age: { max: 99, min: 0 },
    description: null,
    familialle: FAMILY_DEFAULT_VALUES,
    gender: GENDER_DEFAULT_VALUES,
    other: OTHER_DEFAULT_VALUES,
  },
  seo_url: "antenne-marcel-paul-paris-33",
  services_all: [SERVICE_SOCIAL_SUPPORT],
  slugs: {
    infos: {
      description:
        "accueil coute et accompagnement social carte alimentaire et bon vestiaire permanence logement aide aux d marches conseil orientation les permanences sont dor navant sur rendez vous par t l phone ou sur place aux heures de permanence",
      name: "antenne marcel paul secours populaire francais",
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
    hours: {
      actif: true,
      dateDebut: new Date("2021-07-14T00:00:00.000Z"),
      dateFin: new Date("2021-09-06T00:00:00.000Z"),
      description: "",
      hours: {
        description: "A fake temp hours",
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
    },
    message: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      name: null,
    },
    closure: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      name: null,
    },
  },
  updatedAt: new Date("2021-09-10T09:49:09.572Z"),
  updatedByUserAt: new Date("2021-09-10T09:49:09.572Z"),
  visibility: PlaceVisibility.ALL,
};
