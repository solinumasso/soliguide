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
import { captureException, captureMessage } from "@sentry/node";
import { User, UserPopulateType } from "../../_models";
import { hashPassword } from "../../_utils";
import { DEFAULT_USER_POPULATE } from "../constants";

import { UserModel } from "../models/user.model";

export const findByPasswordToken = async (
  token: string
): Promise<Pick<User, "name"> | null> => {
  try {
    return await UserModel.findOne({ passwordToken: token })
      .select("name")
      .lean()
      .exec();
  } catch (error) {
    captureException(error, {
      extra: { tokenProvided: Boolean(token) },
    });
    throw error;
  }
};

export const updatePassword = async (
  token: string,
  password: string
): Promise<UserPopulateType | null> => {
  try {
    return await UserModel.findOneAndUpdate(
      { passwordToken: token },
      {
        $set: {
          password: await hashPassword(password),
        },
        $unset: {
          passwordToken: null,
        },
      },
      { new: true }
    )
      .populate(DEFAULT_USER_POPULATE)
      .lean<UserPopulateType>()
      .exec();
  } catch (error) {
    captureException(error, {
      extra: {
        tokenProvided: Boolean(token),
        passwordProvided: Boolean(password),
      },
    });
    throw error;
  }
};

export const generatePasswordToken = async (
  mail: string,
  hash: string
): Promise<UserPopulateType | null> => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { mail },
      {
        $set: {
          passwordToken: hash,
        },
      },
      { new: true }
    )
      .populate(DEFAULT_USER_POPULATE)
      .select("+passwordToken")
      .lean<UserPopulateType>()
      .exec();

    if (!result) {
      captureMessage("User not found for password token generation", {
        level: "warning",
        extra: {
          mail,
          hashProvided: Boolean(hash),
        },
      });
    }

    return result;
  } catch (error) {
    captureException(error, {
      extra: {
        mail,
        hashProvided: Boolean(hash),
      },
    });
    throw error;
  }
};
