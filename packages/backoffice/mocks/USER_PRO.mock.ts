import {
  UserForAuth,
  UserRole,
  UserStatus,
  CountryCodes,
  CountryAreaTerritories,
} from "@soliguide/common";
import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

export const USER_PRO_MOCK: UserForAuth = {
  _id: "5fd78bb917e8c5648075c785",
  categoriesLimitations: [],
  devToken: null,
  languages: [],
  lastname: "Nom-pro",
  mail: "mail-user-pro@structure.fr",
  name: "Marcel",
  lastLogin: new Date(),
  organizations: [
    new Organisation({
      _id: "5fb648823cb90874d9ab1bef",
      organization_id: 2316,
    }),
  ],
  phone: {
    countryCode: CountryCodes.FR,
    label: null,
    isSpecialPhoneNumber: false,
    phoneNumber: "0667434205",
  },
  places: [2212, 2203, 7485, 2295, 12931],
  role: UserRole.OWNER,
  selectedOrgaIndex: 0,
  status: UserStatus.PRO,
  title: "Président de la structure",
  translator: false,
  user_id: 451,
  verified: true,
  areas: {
    fr: new CountryAreaTerritories<CountryCodes.FR>({
      departments: ["67"],
    }),
  },
};
