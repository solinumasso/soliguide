import { CountryCodes, PostOrganizationPayload } from "@soliguide/common";

export const CREATE_ORGA_OK_SIMPLE: PostOrganizationPayload = {
  description: "",
  facebook: "",
  fax: "",
  mail: "",
  name: "Orga de test",
  phone: null,
  relations: ["ASSOCIATION"],
  territories: ["75"],
  website: "",
  country: CountryCodes.FR,
};

export const CREATE_ORGA_OK_COMPLETE: PostOrganizationPayload = {
  description:
    " Amet fugiat ullamco do magna cillum nulla. Et duis mollit aliqua consectetur laborum anim anim mollit aliquip. Sint ex veniam in voluptate ipsum amet proident anim nulla proident ullamco ullamco labore magna. ",
  facebook: "",
  fax: "",
  mail: "testjimmy@jimmy.fr",
  name: "Organisation sans aucun soucis",
  phone: null,
  relations: ["ASSOCIATION", "API"],
  territories: ["75"],
  website: "https://orgaok.fr",
  country: CountryCodes.FR,
};
