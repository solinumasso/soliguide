import { CommonPlacePosition, CountryCodes } from "@soliguide/common";

export const STEP_EMPLACEMENT_POSITION_OK: Partial<CommonPlacePosition> = {
  address: "27 Rue Saint-Martin, 75004 Paris, France ",
  postalCode: "75004",
  additionalInformation: "Au coin du feu",
  department: "Paris",
  departmentCode: "75",
  location: { coordinates: [2.3499646, 48.85899020000001], type: "Point" },
  pays: CountryCodes.FR,
  country: CountryCodes.FR,
  region: "Île-de-France",
  regionCode: "11",
  city: "Paris",
  timeZone: "Europe/Paris",
};
