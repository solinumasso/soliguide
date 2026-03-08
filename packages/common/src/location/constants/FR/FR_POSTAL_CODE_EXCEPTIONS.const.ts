import { CountryCodes } from "../../enums";
import { DepartmentCode } from "../../types";

export const FR_EXCEPTIONAL_POSTAL_CODES: Record<
  string,
  {
    department: string;
    departmentCode: DepartmentCode<CountryCodes.FR>;
  }
> = {
  // https://fr.wikipedia.org/wiki/Liste_des_communes_de_France_dont_le_code_postal_ne_correspond_pas_au_d%C3%A9partement
  "01200": {
    department: "Haute-Savoie",
    departmentCode: "74",
  },
  "01410": {
    department: "Jura",
    departmentCode: "39",
  },
  "01590": {
    department: "Jura",
    departmentCode: "39",
  },
  "05110": {
    department: "Alpes-de-Haute-Provence",
    departmentCode: "04",
  },
  "05130": {
    department: "Alpes-de-Haute-Provence",
    departmentCode: "04",
  },
  "05160": {
    department: "Alpes-de-Haute-Provence",
    departmentCode: "04",
  },
  "05700": {
    department: "Drôme",
    departmentCode: "26",
  },
  "13780": {
    department: "Var",
    departmentCode: "83",
  },
  "21340": {
    department: "Saône-et-Loire",
    departmentCode: "71",
  },
  "33220": {
    department: "Dordogne",
    departmentCode: "24",
  },
  "37160": {
    department: "Vienne",
    departmentCode: "86",
  },
  "42620": {
    department: "Allier",
    departmentCode: "03",
  },
  "43450": {
    department: "Cantal",
    departmentCode: "15",
  },
  "48250": {
    department: "Ardèche",
    departmentCode: "07",
  },
  "52100": {
    department: "Marne",
    departmentCode: "51",
  },
  "94390": {
    department: "Essonne",
    departmentCode: "91",
  },
  // https://fr.wikipedia.org/wiki/Saint-Barth%C3%A9lemy_(Antilles_fran%C3%A7aises)
  "97133": {
    department: "Saint-Barthélemy",
    departmentCode: "977",
  },
  // https://fr.wikipedia.org/wiki/Saint-Martin_(Antilles_fran%C3%A7aises)
  "97150": {
    department: "Saint-Martin",
    departmentCode: "978",
  },
};
