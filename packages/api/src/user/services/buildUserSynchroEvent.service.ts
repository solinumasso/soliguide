import { randomUUID } from "node:crypto";

import type { Themes } from "@soliguide/common";

import type { UserPopulateType } from "../../_models";
import { AmqpSynchroAirtableUserEvent } from "../../events";
import { UserModel } from "../models/user.model";
import {
  getUserLastCampaignsChangesStatus,
  getUserRightsForCampaignStatus,
  getUserRightsWithParams,
  getUserToUpdateStatus,
} from "./userRights.service";

/**
 * Filet de sécurité pour le sync Brevo/Airtable : si un user atteint le sync
 * sans `campaignUserUuid` (source amont ayant oublié la projection, ou
 * document historique jamais atteint par la migration `20260708...`), on
 * génère + persiste un uuid avant d'émettre l'événement pour que Brevo reçoive
 * toujours la donnée. Update atomique et idempotent (`$exists: false`).
 */
export const ensureCampaignUserUuid = async (
  user: UserPopulateType
): Promise<string> => {
  if (user.campaignUserUuid) {
    return user.campaignUserUuid;
  }

  const campaignUserUuid = randomUUID();
  await UserModel.updateOne(
    { _id: user._id, campaignUserUuid: { $exists: false } },
    { $set: { campaignUserUuid } }
  );
  user.campaignUserUuid = campaignUserUuid;
  return campaignUserUuid;
};

/**
 * Builds the enriched Airtable/Brevo synchro payload for a single user.
 *
 * Single source of truth shared between the real-time flow
 * (`sendUserChangesToMq` middleware) and the one-shot Brevo backfill script,
 * so the payload never diverges between the two. Ensures `userRights` are
 * loaded, backfills `campaignUserUuid` when missing, and resolves the campaign
 * change statuses before constructing the event.
 */
export const buildUserSynchroEvent = async (
  user: UserPopulateType,
  frontendUrl: string,
  theme: Themes | null,
  { isDeleted = false }: { isDeleted?: boolean } = {}
): Promise<AmqpSynchroAirtableUserEvent> => {
  if (!user.userRights?.length) {
    user.userRights = await getUserRightsWithParams({ user: user._id });
  }

  await ensureCampaignUserUuid(user);

  const userRights = await getUserRightsForCampaignStatus(user._id);
  const toUpdate = getUserToUpdateStatus(userRights);
  const { midYear, endYear } = getUserLastCampaignsChangesStatus(userRights);

  return new AmqpSynchroAirtableUserEvent(
    user,
    frontendUrl,
    theme,
    isDeleted,
    toUpdate,
    midYear,
    endYear
  );
};
