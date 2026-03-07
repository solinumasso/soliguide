import { UserStatus, CountryCodes, CommonUser } from "@soliguide/common";
import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

export const COMMON_USER_PRO: CommonUser = {
  createdAt: new Date(),
  updatedAt: new Date(),
  verifiedAt: new Date(),
  lastLogin: new Date(),
  invitations: [],
  blocked: false,
  password: "xx",
  _id: "5fd78bb917e8c5648075c785",
  categoriesLimitations: [],
  devToken: null,
  languages: [],
  lastname: "Nom-pro",
  mail: "mail-user-pro@structure.fr",
  name: "Marcel",
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
  selectedOrgaIndex: 0,
  status: UserStatus.PRO,
  title: "Président de la structure",
  translator: false,
  user_id: 451,
  verified: true,
  territories: ["67"],
};
