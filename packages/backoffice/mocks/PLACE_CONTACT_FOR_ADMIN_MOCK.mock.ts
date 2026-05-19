import {
  CountryCodes,
  PlaceContactForAdmin,
  UserStatus,
} from "@soliguide/common";

export const PLACE_CONTACT_FOR_ADMIN_MOCK: PlaceContactForAdmin = {
  displayContactPro: true,
  name: "Harry",
  lastname: "Maguire",
  mail: "hmaguire@structure-social.fr",
  canEdit: false,
  canEditUserInfos: false,
  phone: {
    phoneNumber: "0606060606",
    countryCode: CountryCodes.FR,
    isSpecialPhoneNumber: false,
    label: null,
  },
  title: "Responsable",
  status: UserStatus.PRO,
  userObjectId: "5ebxsxsx874d79ab12e9",
  _id: "5ebxsxsx874d79ab12e9",
};
