/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import type { Logger } from "pino";

import {
  CAMPAIGN_DEFAULT_NAME,
  type CampaignNameAndAll,
  AllCampaign,
  UserRightStatus,
  CountryCodes,
} from "@soliguide/common";

import { insertMany as insertManyEmailsCampaign } from "../services/email-campaign.service";
import { findPlacesToUpdateWithParams } from "../../campaign/services/places.service";

import { createEmail } from "../utils/createEmail";

import {
  type BodyValidatedCampaignEmails,
  type CampaignEmailName,
  CampaignEmailRemindMe,
  type CampaignEmails,
} from "../../_models";

import { getOneCurrentDepartment } from "../../_utils/functions";

import { searchPlacesWithParams } from "../../search/services";

import { USER_ROLES_FOR_EDITION } from "../../user/constants";

import { FIELDS_FOR_SEARCH } from "../../search/constants/requests";
import { getOrganizationByParams } from "../../organization/services";
import {
  getUserRightsWithParams,
  findUsersToEmail,
  getUserByParams,
  updateUsers,
} from "../../user/services";
import { findOnePlaceChanges } from "../../place-changes/services/place-changes.service";
import type { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import { UserPopulateType } from "../../user/interfaces";

const saveEmails = async (
  emailsToSave: Partial<CampaignEmails>[],
  emailType: CampaignEmailName,
  usersToUpdate: number[] = [],
  campaign: CampaignNameAndAll = CAMPAIGN_DEFAULT_NAME
) => {
  await insertManyEmailsCampaign(emailsToSave);

  if (usersToUpdate.length && campaign !== "ALL_CAMPAIGN") {
    await updateUsers(
      { user_id: { $in: usersToUpdate } },
      { $set: { [`campaigns.${campaign}.${emailType}.ready`]: true } },
      false
    );
  }
};

export const generateCampaignEmails = async (
  bodyValidated: BodyValidatedCampaignEmails,
  frontUrl: string,
  logger: Logger
) => {
  const emailType = bodyValidated.emailType;
  const territories = bodyValidated.territories;

  let nSavedEmails = 0;

  // 1. We look for users to contact (auto-detects if it's a relance or initial campaign)
  const users = await findUsersToEmail(territories, emailType);

  if (!users?.length) {
    logger.warn("[EMAILS] - No user to email");
    return nSavedEmails;
  }

  // 2. We look for places to update
  const placesToUpdate = await findPlacesToUpdateWithParams({
    [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
    [`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`]: false,
    country: CountryCodes.FR,
    $or: [
      { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`]: null },
      {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`]: {
          $exists: true,
          $lt: new Date(),
          $ne: null,
        },
      },
    ],
  });

  if (!placesToUpdate.length) {
    logger.warn("[EMAILS] - NO PLACE TO UPDATE");
    return nSavedEmails;
  }

  logger.info(`[EMAILS] - ${users?.length} users to email`);
  logger.info(`[EMAILS] - ${placesToUpdate.length} places to update`);

  const campaign = CAMPAIGN_DEFAULT_NAME;
  const isInvitation = emailType.includes("INVITATION");

  let emailsToSave = [];
  let usersToUpdate = [];

  for (const user of users) {
    // 3. We check if a user has the permission to update places in the list of places to update
    const userRights = await getUserRightsWithParams(
      {
        place_id: { $in: placesToUpdate, $ne: null },
        role: { $in: USER_ROLES_FOR_EDITION },
        status: isInvitation
          ? UserRightStatus.PENDING
          : UserRightStatus.VERIFIED,
        user: user._id,
      },
      ""
    );

    if (
      !userRights.length ||
      !userRights ||
      (!isInvitation && !user.organizations?.length)
    ) {
      logger.warn(`[EMAILS] - user finally not contacted : ${user.mail}`);
      continue;
    }

    const userTerritories = user?.areas?.fr?.departments ?? [];
    if (userTerritories?.length === 0) {
      console.log("No territories found for " + user._id);
      continue;
    }

    const territory = getOneCurrentDepartment(userTerritories, territories);

    if (territory) {
      // 4. If so, we generate an email for this user
      if (isInvitation) {
        for (const invitation of user.invitations) {
          if (!invitation.organization || !invitation.token) {
            logger.error("ORGANIZATION OR USER NOT FOUND");
            continue;
          }
          const invitationToken = invitation.token;
          const organization = invitation.organization;
          const organization_id = invitation.organization_id;

          emailsToSave.push(
            await createEmail(
              frontUrl,
              campaign,
              invitationToken,
              emailType,
              organization._id,
              organization_id,
              territory,
              user
            )
          );

          usersToUpdate.push(user.user_id);

          nSavedEmails++;

          if (nSavedEmails % 80 === 0) {
            await saveEmails(emailsToSave, emailType, usersToUpdate, campaign);
            emailsToSave = [];
            usersToUpdate = [];
          }
        }
      } else {
        const invitationToken = "";

        const organization = user.organizations[0]._id;
        const organization_id = user.organizations[0].organization_id;

        emailsToSave.push(
          await createEmail(
            frontUrl,
            campaign,
            invitationToken,
            emailType,
            organization,
            organization_id,
            territory,
            user
          )
        );

        usersToUpdate.push(user.user_id);

        nSavedEmails++;

        if (nSavedEmails % 80 === 0) {
          await saveEmails(emailsToSave, emailType, usersToUpdate, campaign);
          emailsToSave = [];
          usersToUpdate = [];
        }
      }
    }
  }

  if (emailsToSave.length) {
    await saveEmails(emailsToSave, emailType, usersToUpdate, campaign);
  }

  return nSavedEmails;
};

export const generateRemindMeEmails = async (
  frontUrl: string
): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const placesToRemind = await searchPlacesWithParams(
    {
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`]: false,
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`]: {
        $gte: today,
        $lt: tomorrow,
      },
    },
    {
      limit: 100,
      page: 1,
      skip: 0,
      sort: { createdAt: 1 },
      fields: FIELDS_FOR_SEARCH.DEFAULT_CAMPAIGN,
    }
  );

  if (placesToRemind.length === 0) {
    return;
  }

  const remindMeChanges: PlaceChanges[] = [];

  for (const place of placesToRemind) {
    const change = await findOnePlaceChanges({
      lieu_id: place.lieu_id,
      new: place.campaigns[CAMPAIGN_DEFAULT_NAME].remindMeDate,
      section: "remindMe",
    });

    if (change) {
      remindMeChanges.push(change);
    }
  }

  if (!remindMeChanges.length) {
    return;
  }

  let nSavedEmails = 0;
  let emailsToSave = [];

  const campaign = AllCampaign.ALL_CAMPAIGN;
  const invitationToken = "";
  const emailType = CampaignEmailRemindMe.REMIND_ME;

  for (const change of remindMeChanges) {
    const organization = await getOrganizationByParams({
      organization_id: change.userData.orgaId,
    });

    const user = await getUserByParams({
      user_id: change.userData.user_id,
    });

    if (!user || !organization) {
      continue;
    }

    const territory = change.territory;

    if (territory) {
      emailsToSave.push(
        await createEmail(
          frontUrl,
          campaign,
          invitationToken,
          emailType,
          organization._id,
          organization.organization_id,
          territory,
          user
        )
      );
      nSavedEmails++;

      if (nSavedEmails % 80 === 0) {
        await saveEmails(emailsToSave, emailType);
        emailsToSave = [];
      }
    }
  }

  if (emailsToSave.length) {
    await saveEmails(emailsToSave, emailType);
  }
};
