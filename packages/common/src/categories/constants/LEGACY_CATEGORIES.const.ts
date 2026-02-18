/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Categories } from "../enums";
import type { LegacyCategory } from "../interfaces";

export const LEGACY_CATEGORIES: Record<number, LegacyCategory> = {
  100: {
    label: "SANTE",
    seo: "sante",
    title: "CAT_SANTE_TITLE",
    newCategory: Categories.HEALTH,
  },
  101: {
    description:
      "Aide aux personnes en situation de dépendance (alcool, cannabis, jeux, etc.)",
    label: "ADDICTION",
    seo: "addiction",
    title: "",
    newCategory: Categories.ADDICTION,
  },
  102: {
    description:
      "Dépistage gratuit des maladies sexuellement transmissibles (MST).",
    label: "DEPISTAGE",
    seo: "depistage",
    title: "",
    newCategory: Categories.STD_TESTING,
  },
  103: {
    description:
      "Soutien psychologique (écoute, permanences psychologue, etc.).",
    label: "PSYCHOLOGIE",
    seo: "psychologie",
    title: "CAT_PSYCHOLOGIE_TITLE",
    newCategory: Categories.PSYCHOLOGICAL_SUPPORT,
  },
  104: {
    description: "Soins dédiés aux bébés et/ou enfants. Ex : PMI.",
    label: "SOINS_ENFANTS",
    seo: "soins-enfants",
    title: "",
    newCategory: Categories.CHILD_CARE,
  },
  105: {
    description:
      "Médecine généraliste, gratuite ou accessible aux personnes sous CMU ou AME.",
    label: "GENERALISTE",
    seo: "generaliste",
    title: "",
    newCategory: Categories.GENERAL_PRACTITIONER,
  },
  106: {
    description:
      "Soins dentaires, gratuits ou accessibles aux personnes sous CMU ou AME.",
    label: "DENTAIRE",
    seo: "dentaire",
    title: "",
    newCategory: Categories.DENTAL_CARE,
  },
  107: {
    description: "Soins pour les femmes enceintes.",
    label: "PLANIFICATION",
    seo: "planification",
    title: "",
    newCategory: Categories.PREGNANCY_CARE,
  },
  108: {
    description:
      "Vaccins gratuits ou accessibles aux personnes sous CMU ou AME.",
    label: "VACCINATION",
    seo: "vaccination",
    title: "",
    newCategory: Categories.VACCINATION,
  },
  109: {
    description:
      "Soins infirmiers (pansements, bandages, médicaments sans ordonnance).",
    label: "INFIRMERIE",
    seo: "infirmerie",
    title: "",
    newCategory: Categories.INFIRMARY,
  },
  110: {
    description: "Soins pour les animaux",
    label: "VETERINAIRE",
    seo: "veterinaire",
    title: "",
    newCategory: Categories.VET_CARE,
  },
  1100: {
    label: "SPECIALISTES",
    seo: "specialistes-medecine",
    title: "",
    newCategory: Categories.HEALTH_SPECIALISTS,
  },
  1101: {
    label: "ALLERGOLOGIE",
    seo: "allergologie",
    title: "",
    newCategory: Categories.ALLERGOLOGY,
  },
  1102: {
    label: "CARDIOLOGIE",
    seo: "cardiologie",
    title: "",
    newCategory: Categories.CARDIOLOGY,
  },
  1103: {
    label: "DERMATOLOGIE",
    seo: "dermatologie",
    title: "",
    newCategory: Categories.DERMATOLOGY,
  },
  1104: {
    label: "ECHOGRAPHIE",
    seo: "echographie",
    title: "",
    newCategory: Categories.ECHOGRAPHY,
  },
  1105: {
    label: "ENDOCRINOLOGIE",
    seo: "endocrinologie",
    title: "",
    newCategory: Categories.ENDOCRINOLOGY,
  },
  1106: {
    label: "GASTRO_ENTEROLOGIE",
    seo: "gastro-enterologie",
    title: "",
    newCategory: Categories.GASTROENTEROLOGY,
  },
  1107: {
    description: "Gynécologue",
    label: "GYNECOLOGIE",
    seo: "gynecologie",
    title: "",
    newCategory: Categories.GYNECOLOGY,
  },
  1108: {
    label: "KINESITHERAPIE",
    seo: "kinesitherapie",
    title: "",
    newCategory: Categories.KINESITHERAPY,
  },
  1109: {
    label: "MAMMOGRAPHIE",
    seo: "mammographie",
    title: "",
    newCategory: Categories.MAMMOGRAPHY,
  },
  1110: {
    label: "OPHTALMOLOGIE",
    seo: "ophtalmologie",
    title: "",
    newCategory: Categories.OPHTHALMOLOGY,
  },
  1111: {
    label: "OTO_RHINO_LARYNGOLOGIE",
    seo: "oto-rhino-laryngologie",
    title: "",
    newCategory: Categories.OTORHINOLARYNGOLOGY,
  },
  1112: {
    label: "NUTRITION",
    seo: "nutrition",
    title: "",
    newCategory: Categories.NUTRITION,
  },
  1113: {
    description: "Pédicure, soigner pieds",
    label: "PEDICURE",
    seo: "pedicure",
    title: "",
    newCategory: Categories.PEDICURE,
  },
  1114: {
    description: "Phlébite, Phlébologue",
    label: "PHLEBOLOGIE",
    seo: "phlebologie",
    title: "",
    newCategory: Categories.PHLEBOLOGY,
  },
  1115: {
    label: "PNEUMOLOGIE",
    seo: "pneumologie",
    title: "",
    newCategory: Categories.PNEUMOLOGY,
  },
  1116: {
    label: "RADIOLOGIE",
    seo: "radiologie",
    title: "",
    newCategory: Categories.RADIOLOGY,
  },
  1117: {
    label: "RHUMATOLOGIE",
    seo: "rhumatologie",
    title: "",
    newCategory: Categories.RHEUMATOLOGY,
  },
  1118: {
    label: "UROLOGIE",
    seo: "urologie",
    title: "",
    newCategory: Categories.UROLOGY,
  },
  1119: {
    label: "ORTHOPHONIE",
    seo: "orthophonie",
    title: "",
    newCategory: Categories.SPEECH_THERAPY,
  },
  1120: {
    label: "STOMATOLOGIE",
    seo: "stomatologie",
    title: "",
    newCategory: Categories.STOMATOLOGY,
  },
  1121: {
    description: "Osthéopathe",
    label: "OSTEO",
    seo: "osteo",
    title: "",
    newCategory: Categories.OSTEOPATHY,
  },
  1122: {
    label: "ACUPUNCTURE",
    seo: "acupuncture",
    title: "",
    newCategory: Categories.ACUPUNCTURE,
  },
  1200: {
    label: "TRANSPORT_MOBILITY",
    seo: "transport-mobilite",
    title: "",
    newCategory: Categories.MOBILITY,
  },
  1201: {
    label: "COVOITURAGE",
    seo: "covoiturage",
    title: "",
    newCategory: Categories.TRANSPORTATION_MOBILITY,
  },
  1202: {
    description: "Mise à disposition de véhicule",
    label: "VEHICULE",
    seo: "vehicule",
    title: "",
    newCategory: Categories.PERSONAL_VEHICLE_ACCESS,
  },
  1203: {
    description: "Transport avec chauffeur",
    label: "CHAUFFEUR",
    seo: "chauffeur",
    title: "",
    newCategory: Categories.TRANSPORTATION_MOBILITY,
  },
  1204: {
    description: "Aide à la mobilité",
    label: "PERMIS",
    seo: "permis",
    title: "",
    newCategory: Categories.MOBILITY_FINANCING,
  },
  200: {
    label: "FORMATION_EMPLOI",
    seo: "formation-emploi",
    title: "",
    newCategory: Categories.TRAINING_AND_JOBS,
  },
  201: {
    description:
      "Permanences ou ateliers visant à la maitrise d'outils informatiques.",
    label: "FORMATION_NUMERIQUE",
    seo: "formation-numerique",
    title: "",
    newCategory: Categories.DIGITAL_TOOLS_TRAINING,
  },
  202: {
    description: "Cours de français (alphabétisation, ASL, FLE, etc.).",
    label: "FORMATION_FRANCAIS",
    seo: "formation-francais",
    title: "CAT_COURS_FRANCAIS_TITLE",
    newCategory: Categories.FRENCH_COURSE,
  },
  203: {
    description:
      "Aide au retour à l'emploi : ateliers de préparation aux entretiens, aide à la recherche d'emploi, atelier CV, etc.",
    label: "ACCOMPAGNEMENT_EMPLOI",
    seo: "accompagnement-emploi",
    title: "",
    newCategory: Categories.JOB_COACHING,
  },
  204: {
    description: "Embauche de personnes en insertion.",
    label: "INSERTION_ACTIVITE_ECONOMIQUE",
    seo: "insertion-activite-economique",
    title: "",
    newCategory: Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY,
  },
  205: {
    description:
      "Soutien scolaire gratuit (préciser le niveau dans la description).",
    label: "SOUTIEN_SCOLAIRE",
    seo: "soutien-scolaire",
    title: "",
    newCategory: Categories.TUTORING,
  },
  300: {
    label: "HYGIENE",
    seo: "hygiene",
    title: "",
    newCategory: Categories.HYGIENE_AND_WELLNESS,
  },
  301: {
    label: "DOUCHE",
    seo: "douche",
    title: "",
    newCategory: Categories.SHOWER,
  },
  302: {
    description: "Lave-linge en accès libre.",
    label: "LAVERIE",
    seo: "laverie",
    title: "",
    newCategory: Categories.LAUNDRY,
  },
  303: {
    description:
      "Ateliers de bien-être : coiffeur, massage, sophrologie, etc. (à préciser dans la description).",
    label: "BIEN_ETRE",
    seo: "bien-etre",
    title: "",
    newCategory: Categories.WELLNESS,
  },
  304: {
    description: "Toilettes en accès libre.",
    label: "TOILETTES",
    seo: "toilettes",
    title: "",
    newCategory: Categories.TOILETS,
  },
  305: {
    description:
      "Distribution de produits d'hygiène féminine pour les périodes de règles (tampons, serviettes hygiéniques, etc)",
    label: "PRODUITS_HYGIENE",
    seo: "produits-hygiene",
    title: "",
    newCategory: Categories.HYGIENE_PRODUCTS,
  },
  306: {
    description: "Masques de protection",
    label: "MASQUES",
    seo: "masques",
    title: "",
    newCategory: Categories.FACE_MASKS,
  },
  400: {
    label: "CONSEIL",
    seo: "conseil",
    title: "",
    newCategory: Categories.COUNSELING,
  },
  401: {
    description:
      "Permanences juridiques (surendettement, demande d'asile, procès, etc.).",
    label: "PERMANENCE_JURIDIQUE",
    seo: "permanence-juridique",
    title: "",
    newCategory: Categories.LEGAL_ADVICE,
  },
  402: {
    description: "Adresse postale et/ou administrative.",
    label: "DOMICILIATION",
    seo: "domiciliation",
    title: "CAT_DOMICILIATION_TITLE",
    newCategory: Categories.DOMICILIATION,
  },
  403: {
    description:
      "Accompagement des personnes dans leur réinsertion (assistantes sociales, permanences, etc.).",
    label: "ACCOMPAGNEMENT_SOCIAL",
    seo: "accompagnement-social",
    title: "",
    newCategory: Categories.SOCIAL_ACCOMPANIMENT,
  },
  404: {
    description: "Aide à la rédaction des couriers administratifs.",
    label: "ECRIVAIN_PUBLIC",
    seo: "ecrivain-public",
    title: "",
    newCategory: Categories.PUBLIC_WRITER,
  },
  405: {
    description:
      "Permanences d'accès aux droits pour les personnes en situation de handicap.",
    label: "CONSEIL_HANDICAP",
    seo: "conseil-handicap",
    title: "",
    newCategory: Categories.DISABILITY_ADVICE,
  },
  406: {
    description:
      "Permanences d'aide administrative (RSA, CMU, allocations, chômage, etc.).",
    label: "CONSEIL_ADMINISTRATIF",
    seo: "conseil-administratif",
    title: "",
    newCategory: Categories.ADMINISTRATIVE_ASSISTANCE,
  },
  407: {
    description:
      "Permanences d'aide pour les jeunes parents et les parents rencontrant des difficultés avec leurs enfants.",
    label: "CONSEIL_PARENTS",
    seo: "conseil-parents",
    title: "",
    newCategory: Categories.PARENT_ASSISTANCE,
  },
  408: {
    label: "CAT_BUDGET_ADVICE",
    seo: "conseil-budget",
    title: "",
    newCategory: Categories.BUDGET_ADVICE,
  },
  500: {
    label: "TECHNOLOGY",
    seo: "technologie",
    title: "",
    newCategory: Categories.TECHNOLOGY,
  },
  501: {
    description: "Ordinateurs disponibles en accès libre.",
    label: "ORDINATEUR",
    seo: "ordinateur",
    title: "",
    newCategory: Categories.COMPUTERS_AT_YOUR_DISPOSAL,
  },
  502: {
    description: "Wifi disponible en accès libre.",
    label: "WIFI",
    seo: "wifi",
    title: "CAT_WIFI_TITLE",
    newCategory: Categories.WIFI,
  },
  503: {
    description: "Prises électriques disponibles en accès libre.",
    label: "PRISE",
    seo: "prise",
    title: "CAT_PRISE_TITLE",
    newCategory: Categories.ELECTRICAL_OUTLETS_AVAILABLE,
  },
  504: {
    description: "Téléphone disponible en accès libre.",
    label: "CAT_PHONE",
    seo: "telephone",
    title: "",
    newCategory: Categories.TELEPHONE_AT_YOUR_DISPOSAL,
  },
  505: {
    description:
      "Reconnect, cloud solidaire est un coffre-fort numérique pour numériser les documents des personnes sans-abri",
    label: "NUMERISATION",
    seo: "numerisation",
    title: "",
    newCategory: Categories.DIGITAL_SAFE,
  },
  600: {
    label: "ALIMENTATION",
    seo: "alimentation",
    title: "CAT_ALIMENTATION_TITLE",
    newCategory: Categories.FOOD,
  },
  601: {
    description:
      "Point d'arrêt d'une distribution alimentaire. <br><u>Attention :</u></b> Veuillez créer une structure par point de distribution.",
    label: "DISTRIBUTION_REPAS",
    seo: "distribution-repas",
    title: "",
    newCategory: Categories.FOOD_DISTRIBUTION,
  },
  602: {
    description:
      "Repas servis assis (petit-déjeuner, collation, boisson, café, thé, déjeuner, gouter ou diner).",
    label: "RESTAURATION_ASSISE",
    seo: "restauration-assise",
    title: "",
    newCategory: Categories.FOOD_DISTRIBUTION,
  },
  603: {
    description:
      "Distribution de paniers contenant des denrées alimentaires (conserves, légumes, etc.).",
    label: "FOOD_PACKAGES",
    seo: "panier-alimentaire",
    title: "",
    newCategory: Categories.FOOD_PACKAGES,
  },
  604: {
    description:
      "Les épiceries sociales et solidaires accueillent les personnes en précarité et leur permettent de faire des courses à prix solidaire.",
    label: "EPICERIE_SOCIALE_SOLIDAIRE",
    seo: "epicerie-sociale-solidaire",
    title: "",
    newCategory: Categories.SOCIAL_GROCERY_STORES,
  },
  605: {
    description: "Eau potable en accès libre.",
    label: "FONTAINE",
    seo: "fontaine",
    title: "",
    newCategory: Categories.FOUNTAIN,
  },
  700: {
    label: "ACCUEIL",
    seo: "accueil",
    title: "",
    newCategory: Categories.WELCOME,
  },
  701: {
    description:
      "Lieu d'accueil des bénéficaires, proposant une pause pendant la journée.",
    label: "ACCUEIL_JOUR",
    seo: "accueil-jour",
    title: "CAT_ACCUEIL_JOUR_TITLE",
    newCategory: Categories.DAY_HOSTING,
  },
  702: {
    description: "Espaces de repos ouverts au public",
    label: "ESPACE_REPOS",
    seo: "espace-repos",
    title: "",
    newCategory: Categories.REST_AREA,
  },
  703: {
    description:
      "Activité d'un baby-sitter consistant à garder temporairement des enfants en l'abscence de leurs parents",
    label: "GARDE_ENFANTS",
    seo: "garde-enfants",
    title: "",
    newCategory: Categories.BABYSITTING,
  },
  704: {
    description:
      "Lieu d'accueil au sein duquel des familles peuvent être reçues",
    label: "ESPACE_FAMILLE",
    seo: "espace-famille",
    title: "",
    newCategory: Categories.FAMILY_AREA,
  },
  705: {
    description: "Point d'information et d'orientation",
    label: "POINT_INFORMATION",
    seo: "point-information",
    title: "CAT_POINT_INFO_TITLE",
    newCategory: Categories.INFORMATION_POINT,
  },
  800: {
    description: "Toute forme d'activité sportive ou culturelle",
    label: "ACTIVITES",
    seo: "activites",
    title: "",
    newCategory: Categories.ACTIVITIES,
  },
  801: {
    description: "Activités sportives : foot, jogging, marche, etc.",
    label: "ACTIVITES_SPORTIVES",
    seo: "activites-sportives",
    title: "",
    newCategory: Categories.SPORT_ACTIVITIES,
  },
  802: {
    description: "Musée gratuit",
    label: "MUSEE",
    seo: "musee",
    title: "",
    newCategory: Categories.MUSEUMS,
  },
  803: {
    description: "Bibliothèque publique",
    label: "BIBLIOTHEQUE",
    seo: "bibliotheque",
    title: "",
    newCategory: Categories.LIBRARIES,
  },
  804: {
    description:
      "Activités diverses : ateliers, activités culturelles, etc. (précisez.)",
    label: "ACTIVITES_DIVERSES",
    seo: "activites-diverses",
    title: "",
    newCategory: Categories.OTHER_ACTIVITIES,
  },
  900: {
    label: "MATERIEL",
    seo: "materiel",
    title: "",
    newCategory: Categories.EQUIPMENT,
  },
  901: {
    description: "Lieu permettant de conserver des bagages ou matériel.",
    label: "BAGAGERIE",
    seo: "bagagerie",
    title: "",
    newCategory: Categories.LUGGAGE_STORAGE,
  },
  902: {
    description: "Boutique vendant du matériel à prix solidaire.",
    label: "BOUTIQUE_SOLIDAIRE",
    seo: "boutique-solidaire",
    title: "",
    newCategory: Categories.SOLIDARITY_STORE,
  },
  903: {
    description:
      "Vêtements gratuits ou à prix symbolique. Préciser le sexe et/ou l'âge dans les conditions.",
    label: "VETEMENTS",
    seo: "vetements",
    title: "CAT_VETEMENTS_TITLE",
    newCategory: Categories.CLOTHING,
  },
  904: {
    description: "Aide aux animaux de compagnie",
    label: "ANIMAUX",
    seo: "animaux",
    title: "",
    newCategory: Categories.ANIMAL_ASSITANCE,
  },
  1300: {
    label: "HOUSING",
    seo: "hebergement-et-logement",
    title: "",
    newCategory: Categories.ACCOMODATION_AND_HOUSING,
  },
  1301: {
    description:
      "La Halte de Nuit est un lieu d'accueil et de repos pour les personnes sans abri ouvert de 20h à 8h du matin, 7/7 jours.",
    label: "HALTE_NUIT",
    seo: "halte-nuit",
    title: "",
    newCategory: Categories.OVERNIGHT_STOP,
  },
  1302: {
    description:
      "Hébergement à court terme (à la nuitée), accessible directement.",
    label: "HEBERGEMENT_URGENCE",
    seo: "hebergement-urgence",
    title: "",
    newCategory: Categories.EMERGENCY_ACCOMMODATION,
  },
  1303: {
    description:
      "Possibilité d'hébergement à long terme, au sein de la structure ou d'une structure partenaire. Indiquer dans la description les modalités d'accès.",
    label: "HEBERGEMENT_LONG_TERME",
    seo: "hebergement-long-terme",
    title: "",
    newCategory: Categories.LONG_TERM_ACCOMODATION,
  },
  1304: {
    description: "Hébergement citoyen à court ou moyen terme",
    label: "HEBERGEMENT_CITOYEN",
    seo: "hebergement-citoyen",
    title: "",
    newCategory: Categories.CITIZEN_HOUSING,
  },
  1305: {
    description:
      "Permanences d'accès au logement (logement social, DALO, etc.).",
    label: "CONSEIL_LOGEMENT",
    seo: "conseil-logement",
    title: "",
    newCategory: Categories.ACCESS_TO_HOUSING,
  },
};

export const LEGACY_CATEGORIES_ID: number[] = Object.keys(
  LEGACY_CATEGORIES
).map((key) => parseInt(key, 10));
