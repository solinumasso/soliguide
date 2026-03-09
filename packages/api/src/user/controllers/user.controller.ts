import mongoose from "mongoose";

import {
  createUser,
  updateUser,
  getUserByParams,
  isUserInOrganization,
} from "../services";

import type {
  OrganizationPopulate,
  SignupUser,
  User,
  UserPopulateType,
} from "../../_models";

import { buildUserAreas } from "../utils";

export const signupWithoutInvitation = async (
  userData: SignupUser
): Promise<UserPopulateType | null> => {
  const user: SignupUser & Pick<User, "verified" | "verifiedAt" | "areas"> = {
    ...userData,
    verified: true,
    verifiedAt: new Date(),
  };

  const { territories, areas } = buildUserAreas(user, userData);

  return await createUser({ ...user, territories, areas });
};

export const patchUserAccount = async (
  userObjectId: string | number | mongoose.Types.ObjectId,
  userData: Partial<User>
): Promise<UserPopulateType | null> => {
  return await updateUser({ _id: userObjectId }, userData);
};

export const getUserByEmail = async (
  mail: string
): Promise<UserPopulateType | null> => {
  return await getUserByParams({
    mail,
  });
};

export const isUserInOrga = async (
  mail: string,
  organization: OrganizationPopulate
): Promise<boolean> => {
  const user = await getUserByParams({
    mail,
  });

  return user ? await isUserInOrganization(user._id, organization._id) : false;
};
