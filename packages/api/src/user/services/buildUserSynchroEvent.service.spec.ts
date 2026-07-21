import { Themes, UserStatus } from "@soliguide/common";
import mongoose from "mongoose";

import type { UserPopulateType } from "../../_models";
import { UserModel } from "../models/user.model";
import { buildUserSynchroEvent } from "./buildUserSynchroEvent.service";
import * as userRightsService from "./userRights.service";

const buildUser = (overrides: Partial<UserPopulateType> = {}): UserPopulateType =>
  ({
    _id: new mongoose.Types.ObjectId(),
    user_id: 42,
    name: "Ada",
    lastname: "Lovelace",
    mail: "ada@example.org",
    status: UserStatus.PRO,
    translator: false,
    verified: true,
    territories: [],
    organizations: [],
    invitations: [],
    userRights: [],
    campaignUserUuid: "existing-uuid",
    ...overrides,
  }) as unknown as UserPopulateType;

describe("buildUserSynchroEvent", () => {
  let getRightsSpy: jest.SpyInstance;
  let toUpdateSpy: jest.SpyInstance;
  let lastChangesSpy: jest.SpyInstance;
  let updateOneSpy: jest.SpyInstance;

  beforeEach(() => {
    getRightsSpy = jest
      .spyOn(userRightsService, "getUserRightsWithParams")
      .mockResolvedValue([]);
    jest
      .spyOn(userRightsService, "getUserRightsForCampaignStatus")
      .mockResolvedValue([]);
    toUpdateSpy = jest
      .spyOn(userRightsService, "getUserToUpdateStatus")
      .mockReturnValue(false);
    lastChangesSpy = jest
      .spyOn(userRightsService, "getUserLastCampaignsChangesStatus")
      .mockReturnValue({ midYear: null, endYear: null });
    updateOneSpy = jest
      .spyOn(UserModel, "updateOne")
      .mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not refetch userRights when the user already has them", async () => {
    await buildUserSynchroEvent(
      buildUser({ userRights: [{ role: "OWNER" }] as never }),
      "https://front/",
      Themes.SOLIGUIDE_FR
    );

    expect(getRightsSpy).not.toHaveBeenCalled();
  });

  it("fetches userRights when the user has none", async () => {
    await buildUserSynchroEvent(
      buildUser({ userRights: [] }),
      "https://front/",
      Themes.SOLIGUIDE_FR
    );

    expect(getRightsSpy).toHaveBeenCalledTimes(1);
  });

  it("does not backfill campaignUserUuid when it is already set", async () => {
    await buildUserSynchroEvent(
      buildUser(),
      "https://front/",
      Themes.SOLIGUIDE_FR
    );

    expect(updateOneSpy).not.toHaveBeenCalled();
  });

  it("backfills campaignUserUuid when it is missing", async () => {
    const user = buildUser({ campaignUserUuid: undefined });

    await buildUserSynchroEvent(user, "https://front/", Themes.SOLIGUIDE_FR);

    expect(updateOneSpy).toHaveBeenCalledTimes(1);
    expect(typeof user.campaignUserUuid).toBe("string");
  });

  it("builds the event with the resolved campaign statuses", async () => {
    toUpdateSpy.mockReturnValue(true);
    lastChangesSpy.mockReturnValue({ midYear: true, endYear: false });

    const event = await buildUserSynchroEvent(
      buildUser(),
      "https://front/",
      Themes.SOLIGUIA_ES,
      { isDeleted: true }
    );

    expect(event.entityType).toBe("USER");
    expect(event.frontendUrl).toBe("https://front/");
    expect(event.theme).toBe(Themes.SOLIGUIA_ES);
    expect(event.deleted).toBe(true);
    expect(event.toUpdate).toBe(true);
    expect(event.hasLastMidYearCampaignChanges).toBe(true);
    expect(event.hasLastEndYearCampaignChanges).toBe(false);
  });
});
