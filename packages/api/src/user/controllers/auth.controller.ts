import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { getUserForLogin } from "../services/users.service";
import { sendUserForAuth } from "../utils/sendUserForAuth";

import { CONFIG } from "../../_models/config/constants/CONFIG.const";
import mongoose from "mongoose";
import { UserForAuth } from "@soliguide/common";

export const getToken = (userId: string | mongoose.Types.ObjectId): string => {
  return jwt.sign({ _id: userId }, CONFIG.JWT_SECRET, {
    expiresIn: "60 days",
  });
};

export const login = async (loginInfos: {
  mail: string;
  password: string;
}): Promise<{ token: string; user: UserForAuth }> => {
  const user = await getUserForLogin(loginInfos.mail);

  if (!user) {
    throw new Error("INVALID_PASSWORD");
  }

  const isPasswordCorrect = await bcrypt.compare(
    loginInfos.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("INVALID_PASSWORD");
  }
  return { token: getToken(user._id), user: sendUserForAuth(user) };
};
