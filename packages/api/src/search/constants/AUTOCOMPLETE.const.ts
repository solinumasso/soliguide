/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import {
  CountryCodes,
  SearchSuggestion,
  SoliguideCountries,
} from "@soliguide/common";

export enum AutoCompleteType {
  CATEGORY = "CATEGORY",
  ESTABLISHMENT_TYPE = "ESTABLISHMENT_TYPE",
  ORGANIZATION = "ORGANIZATION",
  EXPRESSION = "EXPRESSION",
}

export const AUTOCOMPLETE_ORGANIZATIONS: {
  [key in SoliguideCountries]: Pick<
    SearchSuggestion,
    "label" | "synonyms" | "slug"
  >[];
} = {
  [CountryCodes.FR]: [
    {
      label: "Restos du Cœur: association d'aide alimentaire et d'insertion",
      slug: "restos du coeur",
      synonyms: [
        "resto du coeur",
        "restos",
        "resto",
        "péniche du coeur",
        "camion des restos",
        "restaurant du coeur",
        "restaurants du coeur",
        "coluche",
        "relais du coeur",
        "restau",
        "restaus",
      ],
    },
    {
      label: "Secours Catholique: organisation caritative catholique",
      slug: "secours catholique",
      synonyms: [
        "secours cato",
        "caritas",
        "secour cath",
        "secours catholiques",
      ],
    },
    {
      label: "Croix Rouge: organisation humanitaire internationale",
      slug: "croix rouge",
      synonyms: [
        "croix-rouge",
        "croix rouge française",
        "crf",
        "ul",
        "unité locale",
        "vestiboutique",
      ],
    },
    {
      label: "SPF: secours populaire français",
      slug: "secours populaire",
      synonyms: [
        "SPF",
        "secours pop",
        "secours populaire français",
        "secour populaire francais",
      ],
    },
    {
      label: "Emmaüs: mouvement de lutte contre la pauvreté et l'exclusion",
      slug: "emmaus",
      synonyms: [
        "emmaüs",
        "emmaus france",
        "communauté emmaus",
        "abbé pierre",
        "fondation abbé pierre",
      ],
    },
    {
      label: "CAF: caisse des allocations familiales",
      slug: "caf",
      synonyms: [
        "CAF",
        "caisse allocations familiales",
        "allocations",
        "allocations familiales",
      ],
    },
    {
      label: "France Services: guichet unique de services publics",
      slug: "france services",
      synonyms: ["france service", "maison france services", "MFS"],
    },
    {
      label: "CIMADE: service œcuménique d'entraide",
      slug: "cimade",
      synonyms: ["la cimade", "CIMADE", "service œcuménique d'entraide"],
    },
    {
      label: "CIDFF: centre d'information sur les droits des femmes",
      slug: "cidff",
      synonyms: [
        "CIDFF",
        "centre information droits femmes",
        "centre d'information sur les droits des femmes",
      ],
    },
    {
      label: "ADIL: agence départementale d'information sur le logement",
      slug: "adil",
      synonyms: [
        "ADIL",
        "agence départementale information logement",
        "agence d'information sur le logement",
      ],
    },
    {
      label: "CPAM: caisse primaire d'assurance maladie",
      slug: "cpam",
      synonyms: [
        "CPAM",
        "caisse primaire assurance maladie",
        "sécurité sociale",
        "assurance maladie",
      ],
    },
    {
      label: "PIMMS: point information médiation multi services",
      slug: "pimms",
      synonyms: [
        "PIMMS",
        "point information médiation multi services",
        "médiation services",
      ],
    },
    {
      label: "Armée du Salut: organisation chrétienne d'aide sociale",
      slug: "armee du salut",
      synonyms: [
        "armée du salut",
        "salvation army",
        "citadelle",
        "foyer armée du salut",
      ],
    },
    {
      label: "France Travail: service public de l'emploi",
      slug: "france travail",
      synonyms: [
        "pole emploi",
        "pôle emploi",
        "agence pole emploi",
        "PE",
        "anpe",
        "agence france travail",
        "FT",
        "pôle-emploi",
        "pole-emploi",
        "france-travail",
      ],
    },
    {
      label: "Banque Alimentaire: réseau de distribution alimentaire",
      slug: "banque alimentaire",
      synonyms: [
        "banques alimentaires",
        "BA",
        "fédération banques alimentaires",
      ],
    },
    {
      label: "Médecins Sans Frontières: aide médicale humanitaire",
      slug: "msf",
      synonyms: [
        "médecins sans frontières",
        "MSF",
        "doctors without borders",
        "médecin sans frontière",
      ],
    },
    {
      label:
        "Petits Frères des Pauvres: accompagnement des personnes âgées isolées",
      slug: "petits freres des pauvres",
      synonyms: [
        "petits frères des pauvres",
        "petits freres",
        "association petits frères",
      ],
    },
    {
      label: "Secours Islamique France: aide humanitaire et sociale",
      slug: "secours islamique",
      synonyms: [
        "secours islamique france",
        "SIF",
        "secours islamique",
        "aide islamique",
      ],
    },
    {
      label:
        "Fondation pour le Logement des Défavorisés: lutte contre le mal-logement",
      slug: "fondation pour le logement",
      synonyms: [
        "fondation pour le logement des défavorisés",
        "fondation pour le logement",
        "logement défavorisés",
        "mal logement",
        "fondation abbé pierre",
      ],
    },
  ],

  [CountryCodes.ES]: [
    {
      label: "Cruz Roja Española: organisation humanitaire internationale",
      slug: "cruz roja",
      synonyms: [
        "cruz roja",
        "croix rouge espagnole",
        "red cross spain",
        "cruz roja española",
      ],
    },
    {
      label: "Cáritas Española: organisation caritative catholique",
      slug: "caritas",
      synonyms: [
        "caritas",
        "caritas española",
        "caritas espagne",
        "secours catholique espagne",
      ],
    },
    {
      label: "CEAR: comisión española de ayuda al refugiado",
      slug: "cear",
      synonyms: [
        "CEAR",
        "ayuda refugiados",
        "comisión española ayuda refugiados",
      ],
    },
    {
      label: "ACCEM: accueil et accompagnement des migrants et réfugiés",
      slug: "accem",
      synonyms: ["ACCEM", "accem espagne", "aide migrants espagne"],
    },
    {
      label: "Hogar Sí: lutte contre le sans-abrisme",
      slug: "hogar si",
      synonyms: [
        "hogar sí",
        "rais fundación",
        "hogar si espagne",
        "sans abri espagne",
      ],
    },
  ],
  [CountryCodes.AD]: [
    {
      label: "Cruz Roja Andorrana: organisation humanitaire",
      slug: "cruz roja andorra",
      synonyms: [
        "cruz roja andorrana",
        "croix rouge andorre",
        "red cross andorra",
      ],
    },
    {
      label: "Càritas Andorrana: organisation caritative catholique",
      slug: "caritas andorra",
      synonyms: ["caritas andorra", "càritas", "cáritas andorrana"],
    },
    {
      label: "AIRA: associació d’immigrants residents al Principat d’Andorra",
      slug: "aira",
      synonyms: [
        "AIRA",
        "associació immigrants andorra",
        "association immigrés andorre",
      ],
    },
    {
      label:
        "Servei d’Atenció a la Violència de Gènere: soutien aux femmes victimes",
      slug: "servei violencia genere",
      synonyms: [
        "violencia de genere",
        "service violence andorre",
        "violence femmes andorre",
      ],
    },
  ],
};

export const AUTOCOMPLETE_ESTABLISHMENT_TYPES: {
  [key in SoliguideCountries]: Pick<
    SearchSuggestion,
    "label" | "synonyms" | "slug"
  >[];
} = {
  [CountryCodes.FR]: [
    {
      label: "CCAS: centre communal d'action sociale",
      slug: "ccas",
      synonyms: [
        "CCAS",
        "cias",
        "centre communal d'action sociale",
        "centre communal action sociale",
        "centre intercommunal action sociale",
      ],
    },
    {
      label: "Centre socioculturel: structure d'animation et de lien social",
      slug: "centre socioculturel",
      synonyms: ["centre socio culturel", "csc", "centre social"],
    },
    {
      label: "PIJ: point information jeunesse",
      slug: "pij",
      synonyms: [
        "PIJ",
        "point information jeunesse",
        "point info jeunesse",
        "bureau information jeunesse",
        "bij",
        "info jeune",
      ],
    },
    {
      label: "PMI: protection maternelle et infantile",
      slug: "pmi",
      synonyms: [
        "PMI",
        "protection maternelle et infantile",
        "centre pmi",
        "centre de protection maternelle et infantile",
        "bébé",
      ],
    },
    {
      label:
        "Maison de l'autonomie: accompagnement des personnes âgées et handicapées",
      slug: "maison de l'autonomie",
      synonyms: [
        "mda",
        "maison des personnes handicapées",
        "autonomie",
        "mdph",
        "aah",
        "handicap",
        "handicapé",
        "âgées",
        "personnes âgées",
        "agé",
        "agées",
      ],
    },
    {
      label: "CADA: centre d'accueil pour demandeurs d'asile",
      slug: "cada",
      synonyms: [
        "CADA",
        "centre accueil demandeurs asile",
        "centre d'accueil pour demandeurs d'asile",
        "hébergement demandeurs asile",
      ],
    },
    {
      label: "ESI: équipe spécialisée d'insertion",
      slug: "esi",
      synonyms: [
        "ESI",
        "équipe spécialisée d'insertion",
        "équipe spécialisée insertion",
        "service insertion",
      ],
    },
    {
      label: "PASS: permanence d'accès aux soins",
      slug: "pass",
      synonyms: [
        "PASS",
        "permanence d'accès aux soins",
        "permanence accès soins",
        "point accès soins",
      ],
    },
    {
      label: "Mission locale: accompagnement des jeunes vers l'emploi",
      slug: "mission locale",
      synonyms: [
        "missions locales",
        "ML",
        "mission locale jeunes",
        "antenne mission locale",
      ],
    },
    {
      label: "SAS: service d'accompagnement social",
      slug: "sas",
      synonyms: [
        "SAS",
        "service d'accompagnement social",
        "service accompagnement social",
        "structure d'accompagnement",
      ],
    },
    {
      label: "SIAO: service intégré d'accueil et d'orientation",
      slug: "siao",
      synonyms: [
        "SIAO",
        "service intégré accueil orientation",
        "service intégré d'accueil et d'orientation",
        "plateforme siao",
      ],
    },
    {
      label: "CMP: centre médico-psychologique",
      slug: "cmp",
      synonyms: [
        "CMP",
        "centre médico-psychologique",
        "centre médico psychologique",
        "consultation psychiatrie",
      ],
    },
    {
      label: "CHRS: centre d'hébergement et de réinsertion sociale",
      slug: "chrs",
      synonyms: [
        "CHRS",
        "centre hébergement réinsertion sociale",
        "centre d'hébergement et de réinsertion sociale",
        "foyer CHRS",
      ],
    },
    {
      label: "MDS: maison départementale des solidarités",
      slug: "mds",
      synonyms: [
        "MDS",
        "maison des solidarités",
        "maison départementale des solidarités",
        "maison départementale solidarités",
      ],
    },
    {
      label: "Hôpital: établissement de soins médicaux",
      slug: "hopital",
      synonyms: [
        "hôpital",
        "centre hospitalier",
        "CH",
        "CHU",
        "établissement hospitalier",
      ],
    },
    {
      label: "PSA: point santé accueil",
      slug: "psa",
      synonyms: [
        "PSA",
        "point santé accueil",
        "permanence santé accueil",
        "point d'accès santé",
      ],
    },
    {
      label: "CMS: centre médico-social",
      slug: "cms",
      synonyms: [
        "CMS",
        "centre médico-social",
        "centre medico social",
        "dispensaire",
      ],
    },
    {
      label:
        "CSAPA: centre de soins, d'accompagnement et de prévention en addictologie",
      slug: "csapa",
      synonyms: [
        "CSAPA",
        "centre soins accompagnement prévention addictologie",
        "centre addictologie",
        "addiction",
      ],
    },
    {
      label: "Point Justice: accès au droit et à la justice",
      slug: "point justice",
      synonyms: [
        "points justice",
        "maison justice droit",
        "mjd",
        "accès droit",
      ],
    },
    {
      label:
        "CAARUD: centre d'accueil et d'accompagnement à la réduction des risques pour usagers de drogues",
      slug: "caarud",
      synonyms: [
        "CAARUD",
        "centre accueil accompagnement réduction risques usagers drogues",
        "réduction risques",
      ],
    },
    {
      label: "Halte Femme: accueil et accompagnement des femmes en difficulté",
      slug: "halte femme",
      synonyms: [
        "halte femmes",
        "accueil femmes",
        "centre femmes",
        "maison femmes",
      ],
    },
    {
      label: "MDPH: maison départementale des personnes handicapées",
      slug: "mdph",
      synonyms: [
        "MDPH",
        "maison départementale personnes handicapées",
        "handicap",
        "dossier mdph",
      ],
    },
    {
      label: "Maison Relais: logement accompagné pour personnes vulnérables",
      slug: "maison relais",
      synonyms: [
        "maisons relais",
        "pension famille",
        "résidence accueil",
        "logement accompagné",
      ],
    },
    {
      label: "Planning Familial ",
      slug: "planning familial",
      synonyms: [
        "planning",
        "contraception",
        "ivg",
        "conseil conjugal",
        "éducation sexuelle",
      ],
    },
  ],
  [CountryCodes.ES]: [
    {
      label: "Albergue: centre d’hébergement pour sans-abris",
      slug: "albergue",
      synonyms: ["albergue", "refugio", "hébergement social"],
    },
    {
      label: "Comedor social: restaurant solidaire",
      slug: "comedor social",
      synonyms: [
        "comedores sociales",
        "cantine sociale",
        "restaurante solidario",
      ],
    },
    {
      label: "Centro de día: accueil de jour",
      slug: "centro de dia",
      synonyms: ["centro día", "centre de jour", "accueil de jour"],
    },
    {
      label: "Oficina de Extranjería: service public pour étrangers",
      slug: "oficina extranjeria",
      synonyms: [
        "oficina de extranjería",
        "bureau immigration",
        "immigration espagne",
      ],
    },
    {
      label: "CIE: centre d’internement pour étrangers",
      slug: "cie",
      synonyms: [
        "CIE",
        "centro internamiento extranjeros",
        "centre rétention espagne",
      ],
    },
  ],

  [CountryCodes.AD]: [
    {
      label: "Alberg de transeünts: hébergement d’urgence",
      slug: "alberg transeunts",
      synonyms: ["alberg", "albergue", "hébergement andorre"],
    },
    {
      label: "Menjador social: restaurant solidaire",
      slug: "menjador social",
      synonyms: ["menjador", "cantine sociale", "resto solidaire"],
    },
    {
      label: "Servei d’Immigració: service public pour étrangers",
      slug: "servei immigracio",
      synonyms: [
        "servei immigració",
        "service immigration andorre",
        "bureau immigration andorre",
      ],
    },
    {
      label: "Centre de Salut: établissement de soins médicaux",
      slug: "centre salut",
      synonyms: ["centre salut", "hospital nsa", "clinique andorre"],
    },
  ],
};
