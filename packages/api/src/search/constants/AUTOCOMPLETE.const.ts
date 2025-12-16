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
      label: "Restos du Cœur",
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
      label: "Secours Catholique",
      slug: "secours catholique",
      synonyms: [
        "secours cato",
        "caritas",
        "secour cath",
        "secours catholiques",
      ],
    },
    {
      label: "Croix-Rouge française",
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
      label: "Secours Populaire Français",
      slug: "secours populaire",
      synonyms: [
        "SPF",
        "secours pop",
        "secours populaire français",
        "secour populaire francais",
      ],
    },
    {
      label: "Emmaüs",
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
      label: "Maisons France Services",
      slug: "france services",
      synonyms: ["france service", "maison france services", "MFS"],
    },
    {
      label: "La CIMADE",
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
        "anpe",
        "pôle-emploi",
        "pole-emploi",
        "france-travail",
      ],
    },
    {
      label: "Banque Alimentaire",
      slug: "banque alimentaire",
      synonyms: [
        "banques alimentaires",
        "BA",
        "fédération banques alimentaires",
      ],
    },
    {
      label: "Médecins Du Monde (MDM)",
      slug: "mdm",
      synonyms: ["médecins du monde", "mdm", "medecin"],
    },
    {
      label: "Petits Frères des Pauvres",
      slug: "petits freres des pauvres",
      synonyms: [
        "petits frères des pauvres",
        "petits freres",
        "association petits frères",
      ],
    },
    {
      label: "Secours Islamique France",
      slug: "secours islamique",
      synonyms: [
        "secours islamique france",
        "SIF",
        "secours islamique",
        "aide islamique",
      ],
    },
    {
      label: "Fondation pour le Logement des Défavorisés",
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
      label: "Càritas",
      slug: "caritas",
      synonyms: [
        "Cáritas",
        "Caritas",
        "Cáritas Diocesana",
        "Cáritas Parroquial",
        "Red de Cáritas",
        "Cáritas Local",
      ],
    },
    {
      label: "Creu Roja",
      slug: "creu-roja",
      synonyms: [
        "Cruz Roja",
        "Cruz Roja Española",
        "Creu Roja Catalana",
        "Red Cross",
        "Cruz Roja Local",
      ],
    },
    {
      label: "Quàlia",
      slug: "qualia",
      synonyms: ["Qualia", "Fundació Quàlia", "Fundación Qualia"],
    },
    {
      label: "Amisol",
      slug: "amisol",
      synonyms: ["AMISOL", "Associació Amisol", "Asociación Amisol"],
    },
  ],
  [CountryCodes.AD]: [
    {
      label: "Càritas Andorrana",
      slug: "caritas-andorrana",
      synonyms: [
        "Cáritas Andorrana",
        "Cáritas",
        "Cáritas Diocesana",
        "Caritas Andorra",
        "Cáritas Andorra",
      ],
    },
    {
      label: "Creu Roja Andorrana",
      slug: "creu-roja-andorrana",
      synonyms: [
        "Cruz Roja Andorrana",
        "Cruz Roja",
        "Creu Roja",
        "Cruz Roja de Andorra",
        "Red Cross Andorra",
      ],
    },
    {
      label: "Fundació Privada Nostra Senyora de Meritxell (FPNSM)",
      slug: "fundacio-privada-nostra-senyora-de-meritxell-fpnsm",
      synonyms: [
        "FPNSM",
        "Fundación Ntra. Sra. de Meritxell",
        "Fundació Nostra Senyora de Meritxell",
        "Fundación Meritxell",
        "Fundació Meritxell",
      ],
    },
    {
      label: "Carisma",
      slug: "carisma",
      synonyms: [
        "Carisma Andorra",
        "Proyecto Carisma",
        "Programa Carisma",
        "Carisma botiga solidària",
        "Carisma tienda solidaria",
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
      label: "Centre socioculturel",
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
      label: "Mission locale",
      slug: "mission locale",
      synonyms: [
        "missions locales",
        "ML",
        "MIJ",
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
  [CountryCodes.AD]: [
    {
      label: "Centre d'Atenció Primària (CAP)",
      slug: "centre-d-atencio-primaria-cap",
      synonyms: [
        "Centro de Atención Primaria",
        "CAP",
        "Centro de Salud",
        "Atención Primaria",
        "Ambulatorio",
      ],
    },
    {
      label: "Centre Sociosanitari",
      slug: "centre-sociosanitari",
      synonyms: [
        "Centro sociosanitario",
        "Centro socio-sanitario",
        "Equipament sociosanitari",
        "Atenció sociosanitària",
        "Atención sociosanitaria",
      ],
    },
    {
      label: "Casa Pairal",
      slug: "casa-pairal",
      synonyms: [
        "Hogar de jubilados",
        "Casa del jubilado",
        "Llar de jubilats",
        "Centro de mayores",
        "Centro de personas mayores",
      ],
    },
    {
      label: "Escola Bressol",
      slug: "escola-bressol",
      synonyms: [
        "Escuela infantil",
        "Guardería",
        "Llar d'infants",
        "Centro de educación infantil",
        "Parvulario",
      ],
    },
    {
      label: "Horts Gent Gran",
      slug: "horts-gent-gran",
      synonyms: [
        "Huertos para mayores",
        "Huertos Gent Gran",
        "Horts per a la Gent Gran",
        "Huertos comunitarios seniors",
        "Horts municipals",
      ],
    },
    {
      label: "Punt Jove",
      slug: "punt-jove",
      synonyms: [
        "Punto Joven",
        "Centre Jove",
        "Centro Joven",
        "Espai Jove",
        "Punt d'Informació Jove",
      ],
    },
    {
      label: "Servei Social d'Atenció Primària",
      slug: "servei-social-d-atencio-primaria",
      synonyms: [
        "Servicio Social de Atención Primaria",
        "Servicios Sociales de Base",
        "Serveis Socials d'Atenció Primària",
        "Atenció social primària",
        "Atención social primaria",
      ],
    },
    {
      label: "Centre de Dia",
      slug: "centre-de-dia",
      synonyms: [
        "Centro de día",
        "Servei de centre de dia",
        "Atenció diürna",
        "Atención diurna",
        "Centro diurno",
      ],
    },
  ],
  [CountryCodes.ES]: [
    {
      label: "Àrea Bàsica Serveis Socials (ABSS)",
      slug: "area-basica-serveis-socials-abss",
      synonyms: [
        "Área Básica de Servicios Sociales",
        "ABSS",
        "Àrea Bàsica de Serveis Socials",
        "Área Básica SS",
        "Serveis Socials d'Àrea Bàsica",
      ],
    },
    {
      label: "Serveis Socials Bàsics (SSB)",
      slug: "serveis-socials-basics-ssb",
      synonyms: [
        "Servicios Sociales Básicos",
        "SSB",
        "Serveis Socials de Base",
        "Servicios Sociales de Base",
      ],
    },
    {
      label: "Serveis Socials",
      slug: "serveis-socials",
      synonyms: [
        "Servicios Sociales",
        "Servicios Sociales Municipales",
        "Serveis Socials Municipals",
        "Atenció Social Municipal",
      ],
    },
    {
      label: "Serveis bàsics d'atenció social (SBAS)",
      slug: "serveis-basics-d-atencio-social-sbas",
      synonyms: [
        "Servicios básicos de atención social",
        "SBAS",
        "Servicios de atención social básicos",
        "Serveis d'atenció social bàsics",
      ],
    },
    {
      label: "Centre d'Atenció Primària (CAP)",
      slug: "centre-d-atencio-primaria-cap",
      synonyms: [
        "Centro de Atención Primaria",
        "CAP",
        "Centro de Salud",
        "Atención Primaria",
        "Ambulatorio",
      ],
    },
    {
      label: "Oficina Local d'Habitatge",
      slug: "oficina-local-d-habitatge",
      synonyms: [
        "Oficina Local de Vivienda",
        "Oficina de Vivienda",
        "Oficina d'Habitatge",
        "Oficina Municipal de Vivienda",
      ],
    },
    {
      label: "Equip Bàsic d'Atenció Social (EBAS)",
      slug: "equip-basic-d-atencio-social-ebas",
      synonyms: [
        "Equipo Básico de Atención Social",
        "EBAS",
        "Equip Bàsic d'Atenció Social",
        "Equipo Básico Atención Social",
      ],
    },
    {
      label: "Servei d'Informació i Atenció a les Dones (SIAD)",
      slug: "servei-d-informacio-i-atencio-a-les-dones-siad",
      synonyms: [
        "Servicio de Información y Atención a las Mujeres",
        "SIAD",
        "Servei d'Informació i Atenció a les Dones",
        "Punto de Atención a Mujeres",
      ],
    },
    {
      label: "Servei d'Orientació i Acompanyament a les Famílies (SOAF)",
      slug: "servei-d-orientacio-i-acompanyament-a-les-families-soaf",
      synonyms: [
        "Servicio de Orientación y Acompañamiento a las Familias",
        "SOAF",
        "Servei d'Orientació i Acompanyament a les Famílies",
        "Apoyo a Familias",
      ],
    },
    {
      label: "Equip Bàsic d'Atenció Social Primària (EBASP)",
      slug: "equip-basic-d-atencio-social-primaria-ebasp",
      synonyms: [
        "Equipo Básico de Atención Social Primaria",
        "EBASP",
        "Equip Bàsic d'Atenció Social Primària",
        "Equipo Básico ASP",
      ],
    },
    {
      label: "Centre d'atenció continuada i urgent (CUAP)",
      slug: "centre-d-atencio-continuada-i-urgent-cuap",
      synonyms: [
        "Centro de atención continuada y urgente",
        "CUAP",
        "Urgencias de Atención Primaria",
        "Atención continuada",
      ],
    },
    {
      label: "Consultori local (CL)",
      slug: "consultori-local-cl",
      synonyms: [
        "Consultorio local",
        "CL",
        "Consultori municipal",
        "Consultorio municipal",
      ],
    },
    {
      label: "Llar residència",
      slug: "llar-residencia",
      synonyms: [
        "Centro residencial",
        "Residencia",
        "Llar residencial",
        "Hogar residencial",
      ],
    },
    {
      label: "Centre d'Atenció Social",
      slug: "centre-d-atencio-social",
      synonyms: [
        "Centro de Atención Social",
        "Atenció Social Municipal",
        "Atención Social Municipal",
      ],
    },
    {
      label: "Tallers en Ruta",
      slug: "tallers-en-ruta",
      synonyms: [
        "Talleres en Ruta",
        "Programa Talleres en Ruta",
        "Tallers itinerants",
      ],
    },
    {
      label: "Serveis comarcals",
      slug: "serveis-comarcals",
      synonyms: [
        "Servicios comarcales",
        "Serveis supramunicipals",
        "Servicios supramunicipales",
      ],
    },
  ],
};
