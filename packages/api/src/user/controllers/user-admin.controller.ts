import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import type { Logger } from "pino";

import type { SearchResults } from "@soliguide/common";

import {
  deleteInvitationWithParams,
  deleteUserRights,
  generateSearchUserQuery,
} from "../services";

import {
  countUsers,
  deleteUserWithParams,
  searchUsers as searchUsersService,
  updateUser,
} from "../services/users.service";

import {
  CONFIG,
  type InvitationPopulate,
  type ModelWithId,
  type OrganizationPopulate,
  type User,
  type UserPopulateType,
} from "../../_models";

import { getMongoId } from "../../_utils/functions/mongo";
import { mongooseConnection } from "../../config/database/connection";
import { logger as defaultLogger } from "../../general/logger";
import { pullUserFromOrganization } from "../../organization/services";
import { generateSearchOptions } from "../../search/utils";

export const searchUsers = async (
  searchUsersData: any,
  user: ModelWithId<User>
): Promise<SearchResults<ModelWithId<User>>> => {
  const searchUsersQuery = generateSearchUserQuery(searchUsersData, user);

  const nbResults = await countUsers(searchUsersQuery);

  const searchUsersOptions = generateSearchOptions(
    nbResults,
    searchUsersData.options
  );

  const results = await searchUsersService(
    searchUsersQuery,
    searchUsersOptions,
    searchUsersData.context
  );

  return {
    nbResults,
    results,
  };
};

export const removeFromDev = async (
  userObjectId: string | mongoose.Types.ObjectId
): Promise<UserPopulateType | null> => {
  return updateUser({ _id: userObjectId }, { blocked: true });
};

export const createDevToken = async (
  userObjectId: string
): Promise<UserPopulateType | null> => {
  const token = jwt.sign(
    { _id: new mongoose.Types.ObjectId(userObjectId) },
    CONFIG.JWT_SECRET,
    {
      expiresIn: "365 days",
    }
  );

  return updateUser({ _id: userObjectId }, { devToken: token });
};

export const deleteUser = async (
  user: UserPopulateType,
  logger: Logger = defaultLogger
): Promise<void> => {
  logger.info("Remove user to associated organizations");

  const session = await mongooseConnection.startSession();

  await mongooseConnection
    .transaction(async (session) => {
      const organizationsToUpdate: mongoose.Types.ObjectId[] =
        user.organizations.map((organization: OrganizationPopulate) =>
          getMongoId(organization._id)
        );

      const invitationsToDelete: mongoose.Types.ObjectId[] = [];

      if (user?.invitations?.length) {
        logger.info("Remove invitations to organizations");
        logger.info(`${user.invitations.length} invitations to remove`);

        user.invitations.forEach((invitation: InvitationPopulate) => {
          invitationsToDelete.push(getMongoId(invitation._id));
          organizationsToUpdate.push(getMongoId(invitation.organization._id));
        });

        await pullUserFromOrganization(
          [user._id],
          organizationsToUpdate,
          invitationsToDelete,
          session
        );
      }

      logger.info("Delete invitations associated to user");
      await deleteInvitationWithParams({ user: user._id }, session);

      logger.info("Delete rights");
      await deleteUserRights({ user: user._id }, session);

      logger.info("Delete user");
      await deleteUserWithParams(
        {
          _id: user._id,
        },
        session
      );
    })
    .finally(() => {
      session.endSession();
    });
};
