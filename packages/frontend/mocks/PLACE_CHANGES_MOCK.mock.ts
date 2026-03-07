import {
  CampaignSource,
  PlaceChangesSection,
  PlaceChangesStatus,
  SupportedLanguagesCode,
  UserRole,
} from "@soliguide/common";

import { ONLINE_PLACE_MOCK } from "./ONLINE_PLACE.mock";
import { USER_PRO_MOCK } from "./USER_PRO.mock";

import { PlaceChanges } from "../src/app/models/place-changes";
import { generateCompleteName } from "../src/app/shared/functions";

export const PLACE_CHANGES_MOCK: PlaceChanges = new PlaceChanges({
  _id: "5fb61d3a3cb90874d9ab12e2",
  campaignName: null,
  createdAt: new Date("2022-02-18T17:35:05"),
  isCampaign: false,
  lieu_id: 1,
  new: ONLINE_PLACE_MOCK,
  noChanges: false,
  old: ONLINE_PLACE_MOCK,
  section: PlaceChangesSection.status,
  source: CampaignSource.CALL,
  place: ONLINE_PLACE_MOCK,
  status: PlaceChangesStatus.NOT_EVALUATED,
  updatedAt: new Date("2022-03-18T11:02:16"),
  userData: {
    orgaId: USER_PRO_MOCK.organizations[0].organization_id,
    orgaName: USER_PRO_MOCK.organizations[0].name,
    email: USER_PRO_MOCK.mail,
    status: USER_PRO_MOCK.status,
    territory: USER_PRO_MOCK.areas.fr.departments[0],
    userName: generateCompleteName(USER_PRO_MOCK.name, USER_PRO_MOCK.lastname),
    language: SupportedLanguagesCode.FR,
    role: UserRole.EDITOR,
    referrer: null,
    user_id: USER_PRO_MOCK.user_id,
  },
  territory: "93",
  userName: generateCompleteName(USER_PRO_MOCK.name, USER_PRO_MOCK.lastname),
});
