import { CountryCodes } from "@soliguide/common";
import { Logos } from "../types";

export interface LogoWithLink extends Logos {
  link: string;
  size: "small" | "large";
}

const LOGOS_BASE_PATH = "../../../../../assets/images/poctefa-logos";

export const ALL_LOGOS: LogoWithLink[] = [
  {
    path: `${LOGOS_BASE_PATH}/isologo.svg`,
    alt: "iSocial",
    link: "https://isocial.cat/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/solinum.svg`,
    alt: "Solinum",
    link: "https://www.solinum.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/andorra-recerca-innovacio-ca.svg`,
    alt: "Andorra Research & Innovation",
    link: "https://www.ari.ad/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/alba-verd.svg`,
    alt: "Alba",
    link: "https://aalba.cat/ca/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/pere-claver.png`,
    alt: "Pere Claver",
    link: "https://www.pereclaver.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/fundacio-resilis.svg`,
    alt: "Fundació Resilis",
    link: "https://www.resilis.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/poctefa.svg`,
    alt: "Interreg POCTEFA",
    link: "https://www.poctefa.eu/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/diputacio-de-tarragona.svg`,
    alt: "Diputació de Tarragona",
    link: "https://www.dipta.cat/",
    size: "small",
  },
  {
    path: `${LOGOS_BASE_PATH}/generalitat-catalunya.jpg`,
    alt: "Departament de Drets Socials i Inclúsió",
    link: "https://dretssocials.gencat.cat/ca/inici/",
    size: "small",
  },
];

export const LOGOS_BY_COUNTRY: Partial<Record<CountryCodes, string[]>> = {
  [CountryCodes.ES]: [
    "Alba",
    "Andorra Research & Innovation",
    "Departament de Drets Socials i Inclúsió",
    "Diputació de Tarragona",
    "Fundació Resilis",
    "Interreg POCTEFA",
    "iSocial",
    "Pere Claver",
    "Solinum",
  ],
  [CountryCodes.AD]: [
    "Alba",
    "Andorra Research & Innovation",
    "Andorra Research & Innovation",
    "Departament de Drets Socials i Inclúsió",
    "Diputació de Tarragona",
    "Fundació Resilis",
    "Interreg POCTEFA",
    "iSocial",
    "Pere Claver",
    "Solinum",
  ],
  [CountryCodes.FR]: [], // No partner logos for France currently
};

export const FUNDERS_BY_COUNTRY: Partial<Record<CountryCodes, string[]>> = {
  [CountryCodes.ES]: [
    "Interreg POCTEFA",
    "Diputació de Tarragona",
    "Departament de Drets Socials i Inclúsió",
  ],
  [CountryCodes.AD]: [
    "Interreg POCTEFA",
    "Diputació de Tarragona",
    "Departament de Drets Socials i Inclúsió",
  ],
  [CountryCodes.FR]: [],
};
