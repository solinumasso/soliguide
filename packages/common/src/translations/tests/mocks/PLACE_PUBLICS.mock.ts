import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  Publics,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  WelcomedPublics,
} from "../../../publics";
import { SupportedLanguagesCode } from "../../enums";
import { PublicsOther } from "../../../publics/enums/PublicsOther.enum";

export interface PlacePublicsMock {
  lieu_id: number;
  publics: Publics;
  expectedResults: {
    [key in SupportedLanguagesCode]: string;
  };
  name: string;
}

export const PLACE_PUBLICS_MOCK: PlacePublicsMock[] = [
  {
    expectedResults: {
      ar: "ترحيب خاص: الكبار, الناس المعزولون, أزواج.",
      ca: "Adreçat només a col·lectius específics: adults, persones aïllades, parelles.",
      en: "Exclusive welcome: adults, isolated people, couples.",
      es: "Dirigido solo a colectivos específicos: adultos, personas aisladas, parejas.",
      fa: "استقبال انحصاری: بزرگسالان, افراد منزوی, زوج ها.",
      fr: "Accueil exclusif: personnes majeures, personnes isolées, couples.",
      ka: "Ექსკლუზიური მისალმება: მოზარდები, იზოლირებული ხალხი, წყვილები.",
      ps: "ځانګړې ښه راغلاست: لویان, جلا شوي خلک, جوړه.",
      pt: "Bem-vindos exclusivamente: adultos, pessoas isoladas, casais.",
      ro: "Bun venit exclusiv: adultii, oameni izolați, cupluri.",
      ru: "Эксклюзивное приветствие: взрослые люди, изолированные люди, пары.",
      uk: "Ексклюзивний прийом: дорослі, ізольовані люди, пари.",
    },
    lieu_id: 21,
    name: "Accueil exclusif personnes majeures, personnes isolées, couples. - ESI La maison dans la rue",
    publics: {
      accueil: WelcomedPublics.EXCLUSIVE,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: {
        max: 99,
        min: 18,
      },
      description: null,
      familialle: [PublicsFamily.isolated, PublicsFamily.couple],
      gender: GENDER_DEFAULT_VALUES,
      other: [],
    },
  },
  {
    expectedResults: {
      ar: "ترحيب غير مشروط يتكيف مع نساء, اللاجئون, طالبي اللجوء, الناس المعزولون, النساء الحوامل, الطلاب, الناس في الدعارة.",
      ca: "Acollida incondicional adaptada a dones, refugiats/ades, sol·licitants d'asil, persones aïllades, dones embarassades, estudiants, en situació de prostitució.",
      en: "Unconditional welcome adapted to women, refugees, asylum seekers, isolated people, pregnant women, students, people in prostitution situations.",
      es: "Acogida incondicional adaptada a mujeres, refugiados/as, solicitantes de asilo, personas aisladas, mujeres embarazadas, estudiantes, en situación de prostitución.",
      fa: "استقبال بی قید و شرط سازگار با زنان, پناهندگان, پناهجویان, افراد منزوی, زنان حامله, دانش آموزان, افراد در فحشا.",
      fr: "Accueil inconditionnel adapté aux femmes, réfugiés / réfugiées, demandeurs / demandeuses d'asile, personnes isolées, femmes enceintes, étudiants / étudiantes, personnes en situation de prostitution.",
      ka: "Უპირობო მისალმება ადაპტირებულია ქალები, ლტოლვილები, თავშესაფრის მაძიებლები, იზოლირებული ხალხი, ორსული ქალი, სტუდენტები, პროსტიტუციაში მყოფი ადამიანები.",
      ps: "غیر مشروط ښه راغلاست سره تطبیق شوی ښځې, کډوال, پناه غوښتونکي, جلا شوي خلک, امیندواره میرمنې, زده کوونکی, په فحشا کې خلک.",
      pt: "Acolhimento incondicional adaptado a mulheres, refugiados, requerentes de asilo, pessoas isoladas, mulheres grávidas, estudantes e pessoas em situação de prostituição.",
      ro: "Bun venit neconditionat adaptat la femei, refugiati, solicitanții de azil, oameni izolați, femeile însărcinate, elevi, oameni în prostituție.",
      ru: "Безоговорочный прием, адаптированный к женщины, беженцы, лица, ищущие убежища, изолированные люди, беременные женщины, студенты, люди, занимающиеся проституцией.",
      uk: "Беззастережний прийом пристосований до жінки, біженці, особи, які шукають притулку, ізольовані люди, вагітні жінки, студентів, люди, які займаються проституцією.",
    },
    lieu_id: 300,
    name: "Accueil inconditionnel adapté aux femmes, réfugiés / réfugiées, demandeurs / demandeuses d'asile, personnes isolées, femmes enceintes, étudiants / étudiantes, personnes en situation de prostitution.",
    publics: {
      accueil: 1,
      administrative: [
        PublicsAdministrative.refugee,
        PublicsAdministrative.asylum,
      ],
      age: {
        max: 99,
        min: 0,
      },
      description: null,
      familialle: [PublicsFamily.isolated, PublicsFamily.pregnant],
      gender: [PublicsGender.women],
      other: [PublicsOther.student, PublicsOther.prostitution],
    },
  },
  {
    expectedResults: {
      ar: "ترحيب غير مشروط",
      ca: "Adreçat a tothom",
      en: "Unconditional welcome",
      es: "Dirigido a todo el mundo",
      fa: "استقبال بی قید و شرط",
      fr: "Accueil inconditionnel",
      ka: "უპირობო მისალმება",
      ps: "غیر مشروط ښه راغلاست",
      pt: "Acolhimento incondicional",
      ro: "Bun venit neconditionat",
      ru: "Безоговорочный прием",
      uk: "Беззастережний прийом",
    },
    lieu_id: 30,
    name: "Accueil inconditionnel : Bus Abri",
    publics: {
      accueil: WelcomedPublics.UNCONDITIONAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: {
        max: 99,
        min: 0,
      },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    },
  },
];
