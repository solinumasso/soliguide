import { SoliguideCountries } from "../../location";
import { ApiOrganization } from "../interfaces/ApiOrganization.interface";

export type PostOrganizationPayload = Pick<
  ApiOrganization,
  | "name"
  | "territories"
  | "description"
  | "phone"
  | "mail"
  | "website"
  | "facebook"
  | "fax"
  | "relations"
> & {
  country: SoliguideCountries;
};
