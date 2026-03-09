import { CountryCodes } from "@soliguide/common";
import { WidgetPlace } from "../classes";

export const DEFAULT_WIDGET_PLACE = new WidgetPlace({
  _id: "default-place-id",
  lieu_id: 0,
  seo_url: "default-place-seo-url",
  name: "Nom du lieu",
  entity: {
    phones: [
      {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    ],
  },
  position: {
    complementAdresse: null,
    address: "21 rue des Dames, 75017 Paris",
    adresse: "21 rue des Dames, 75017 Paris",
    codePostal: "75017",
    postalCode: "75017",
    cityCode: "75117",
    department: "Paris",
    departement: "Paris",
    city: "Paris",
    ville: "Paris",
    departmentCode: "75",
    departementCode: "75",
    location: {
      coordinates: [2.3247446268353475, 48.884793024789374],
      type: "Point",
    },
    country: CountryCodes.FR,
    pays: CountryCodes.FR,
    region: "Île-de-France",
    regionCode: "11",
    timeZone: "Europe/Paris",
  },
  distance: 3.5,
  isOpenToday: true,
});
