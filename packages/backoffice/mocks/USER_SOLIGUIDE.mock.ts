import { User } from "../src/app/modules/users/classes/user.class";
import { CountryCodes, UserStatus } from "@soliguide/common";

export const USER_SOLIGUIDE_MOCK: User = new User({
  _id: "xxxx",
  categoriesLimitations: [],
  devToken: null,
  languages: [],
  lastname: "USER LAST NAME",
  mail: "USER@solinum.org",
  name: "USER FIRST NAME",
  organizations: [],
  phone: {
    phoneNumber: "0606060606",
    countryCode: CountryCodes.FR,
    isSpecialPhoneNumber: false,
    label: null,
  },
  places: [],
  role: null,
  selectedOrgaIndex: 0,
  status: UserStatus.ADMIN_SOLIGUIDE,
  title: "Chips",
  translator: false,
  user_id: 1433,
  verified: true,
});
