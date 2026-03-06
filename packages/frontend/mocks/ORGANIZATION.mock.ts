import { ONLINE_PLACE_MOCK } from "./ONLINE_PLACE.mock";

import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

import { OrgaCampaignStatus } from "../src/app/models/campaign/types/CampaignStatus.type";

export const ORGANIZATION_MOCK: Organisation = new Organisation({
  _id: "5fb648823cb90874d9ab1bef",
  campaigns: {
    runningCampaign: {
      autonomyRate: 0,
      endDate: null,
      startDate: null,
      status: OrgaCampaignStatus.TO_DO,
      toUpdate: true,
    },
  },
  createdAt: new Date("2020-11-19T08:59:48.182Z"),
  description: "Ceci est une belle orga de test",
  facebook: "",
  fax: "",
  invitations: [],
  logo: null,
  mail: "mon-orga@orga.fr",
  name: "Organisme de test",
  organization_id: 2316,
  phone: null,
  places: [ONLINE_PLACE_MOCK],
  priority: false,
  relations: [],
  territories: ["75"],
  updatedAt: new Date("2021-06-10T09:54:21.104Z"),
  users: [],
  verified: {
    date: new Date("2020-12-07T14:48:25.000Z"),
    status: true,
  },
  website: "http://test.orga.fr",
});
