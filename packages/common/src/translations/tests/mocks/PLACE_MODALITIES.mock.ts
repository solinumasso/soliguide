import type { Modalities } from "../../../modalities";
import { SupportedLanguagesCode } from "../../enums";

export interface PlaceModalitiesMock {
  lieu_id: number;
  modalities: Modalities;
  expectedResults: {
    [key in SupportedLanguagesCode]: string;
  };
  name: string;
}

export const PLACE_MODALITIES_MOCK: PlaceModalitiesMock[] = [
  {
    expectedResults: {
      ar: "",
      ca: "",
      en: "",
      es: "",
      fa: "",
      fr: "",
      ka: "",
      ps: "",
      pt: "",
      ro: "",
      ru: "",
      uk: "",
    },
    lieu_id: 21,
    modalities: {
      inconditionnel: true,
      appointment: {
        checked: false,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: false,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: null,
      thermalComfort: { heated: null, airConditioned: null },
    },
    name: "Unconditional - ESI La maison dans la rue",
  },
  {
    expectedResults: {
      ar: "بناءً على موعد",
      ca: "Amb cita prèvia",
      en: "By appointment only",
      es: "Con cita previa",
      fa: "در قرار ملاقات",
      fr: "Sur rendez-vous",
      ka: "Დანიშვნაზე",
      ps: "په تقرر کې",
      pt: "Somente com hora marcada",
      ro: "Pe bază de programare",
      ru: "Только по предварительной записи",
      uk: "За призначенням",
    },
    lieu_id: 300,
    modalities: {
      inconditionnel: false,
      appointment: {
        checked: true,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: false,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: null,
      thermalComfort: { heated: null, airConditioned: null },
    },
    name: "Accueil exclusif en situation régulière. - Service Social de Proximité (SSP) du 18ème ",
  },
  {
    expectedResults: {
      ar: "الحيوانات المقبولة\nتفاصيل أخرى: Data in french, only for test",
      ca: "S'accepten animals\nAltres detalls: Data in french, only for test",
      en: "Animals accepted\nOther details: Data in french, only for test",
      es: "Se aceptan animales\nOtros detalles: Data in french, only for test",
      fa: "حیوانات پذیرفته شده\nجزئیات دیگر: Data in french, only for test",
      fr: "Animaux acceptés\nAutres précisions: Data in french, only for test",
      ka: "Პაროლები უნდა იყოს იგივე\nᲡხვა დეტალები: Data in french, only for test",
      ps: "منل شوي څاروي\nنور جزیات: Data in french, only for test",
      pt: "Animais aceites\nOutros detalhes: Dados em francês, apenas para teste",
      ro: "Animalele sunt binevenite\nAlte detalii: Data in french, only for test",
      ru: "Принятые животные\nДругие детали: Data in french, only for test",
      uk: "Прийнятих тварин\nІнші деталі: Data in french, only for test",
    },
    lieu_id: 30,
    modalities: {
      inconditionnel: true,
      appointment: {
        checked: false,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: true,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: "Data in french, only for test",
      thermalComfort: { heated: null, airConditioned: null },
    },
    name: "Accueil inconditionnel : Bus Abri",
  },
  {
    expectedResults: {
      ar: "مكان مكيف",
      ca: "Lloc climatitzat",
      en: "Air-conditioned place",
      es: "Lugar climatizado",
      fa: "مکان دارای تهویه مطبوع",
      fr: "Lieu climatisé",
      ka: "Კონდიცირებული ადგილი",
      ps: "د اېرکنډېشن ځای",
      pt: "Local com ar condicionado",
      ro: "Loc cu aer condiționat",
      ru: "Место с кондиционером",
      uk: "Місце з кондиціонером",
    },
    lieu_id: 500,
    modalities: {
      inconditionnel: true,
      appointment: { checked: false, precisions: null },
      inscription: { checked: false, precisions: null },
      orientation: { checked: false, precisions: null },
      price: { checked: false, precisions: null },
      animal: { checked: false },
      pmr: { checked: false },
      docs: [],
      other: null,
      thermalComfort: { heated: null, airConditioned: true },
    },
    name: "Air-conditioned place",
  },
  {
    expectedResults: {
      ar: "مكان غير مكيف",
      ca: "Lloc no climatitzat",
      en: "Non-air-conditioned place",
      es: "Lugar sin climatización",
      fa: "مکان بدون تهویه مطبوع",
      fr: "Lieu non climatisé",
      ka: "Არაკონდიცირებული ადგილი",
      ps: "بې اېرکنډېشن ځای",
      pt: "Local sem ar condicionado",
      ro: "Loc fără aer condiționat",
      ru: "Место без кондиционера",
      uk: "Місце без кондиціонера",
    },
    lieu_id: 501,
    modalities: {
      inconditionnel: true,
      appointment: { checked: false, precisions: null },
      inscription: { checked: false, precisions: null },
      orientation: { checked: false, precisions: null },
      price: { checked: false, precisions: null },
      animal: { checked: false },
      pmr: { checked: false },
      docs: [],
      other: null,
      thermalComfort: { heated: null, airConditioned: false },
    },
    name: "Not air-conditioned place",
  },
];
