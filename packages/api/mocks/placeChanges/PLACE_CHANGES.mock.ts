import {
  CampaignSource,
  PlaceChangesSection,
  PlaceType,
  SupportedLanguagesCode,
  UserRole,
  UserStatus,
} from "@soliguide/common";
import { PlaceChanges } from "../../src/place-changes/interfaces/PlaceChanges.interface";

export const PLACE_CHANGES_MOCK: Partial<PlaceChanges> = {
  campaignName: null,
  isCampaign: false,
  lieu_id: 0,
  source: CampaignSource.CALL,
  placeType: PlaceType.ITINERARY,
  userName: "x",
  new: {
    field: "value",
    fieldNumber: 2,
    fieldObject: {
      subfield: "subvalue",
    },
  },
  old: {
    field: "value",
    fieldNumber: 1,
    fieldObject: {
      subfield: "subvalue",
    },
  },
  section: PlaceChangesSection.place,
  territory: "01",
  userData: {
    orgaId: 0,
    language: SupportedLanguagesCode.EN,
    user_id: 1,
    userName: "Test",
    orgaName: "test",
    email: "test@test.fr",
    referrer: "xx",
    role: UserRole.OWNER,
    status: UserStatus.PRO,
    territory: "01",
  },
};
