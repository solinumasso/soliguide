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
import { AnyBulkWriteOperation, Db } from "mongodb";

import { logger } from "../../src/general/logger";
import {
  FR_DEPARTMENT_CODES,
  type CountryCodes,
  type DepartmentCode,
} from "@soliguide/common";
import { User } from "../../src/_models";
import { deleteUser } from "../../src/user/controllers/user-admin.controller";
import { getUserByParams } from "../../src/user/services";

const message = "Convert email adresses";

const EMAIL_CHANGE_PER_TERRITORY: {
  [key in DepartmentCode<CountryCodes.FR> | "00"]?: {
    new: string;
    old: string;
  };
} = {
  "00": { old: "", new: "" },
  // "01": { old: "", new: "" },
  // "02": { old: "", new: "" },
  // "03": { old: "", new: "" },
  // "04": { old: "", new: "" },
  // "05": { old: "", new: "" },
  // "06": { old: "", new: "" },
  // "07": { old: "", new: "" },
  // "08": { old: "", new: "" },
  // "09": { old: "", new: "" },
  // "10": { old: "", new: "" },
  // "11": { old: "", new: "" },
  // "12": { old: "", new: "" },
  // "13": { old: "", new: "" },
  // "14": { old: "", new: "" },
  // "15": { old: "", new: "" },
  // "16": { old: "", new: "" },
  // "17": { old: "", new: "" },
  // "18": { old: "", new: "" },
  // "19": { old: "", new: "" },
  // "2A": { old: "", new: "" },
  // "2B": { old: "", new: "" },
  // "21": { old: "", new: "" },
  // "22": { old: "", new: "" },
  // "23": { old: "", new: "" },
  // "24": { old: "", new: "" },
  // "25": { old: "", new: "" },
  // "26": { old: "", new: "" },
  // "27": { old: "", new: "" },
  // "28": { old: "", new: "" },
  // "29": { old: "", new: "" },
  // "30": { old: "", new: "" },
  // "31": { old: "", new: "" },
  // "32": { old: "", new: "" },
  // "33": { old: "", new: "" },
  // "34": { old: "", new: "" },
  // "35": { old: "", new: "" },
  // "36": { old: "", new: "" },
  // "37": { old: "", new: "" },
  // "38": { old: "", new: "" },
  // "39": { old: "", new: "" },
  // "40": { old: "", new: "" },
  // "41": { old: "", new: "" },
  // "42": { old: "", new: "" },
  // "43": { old: "", new: "" },
  // "44": { old: "", new: "" },
  // "45": { old: "", new: "" },
  // "46": { old: "", new: "" },
  // "47": { old: "", new: "" },
  // "48": { old: "", new: "" },
  // "49": { old: "", new: "" },
  // "50": { old: "", new: "" },
  // "51": { old: "", new: "" },
  // "52": { old: "", new: "" },
  // "53": { old: "", new: "" },
  // "54": { old: "", new: "" },
  // "55": { old: "", new: "" },
  // "56": { old: "", new: "" },
  // "57": { old: "", new: "" },
  // "58": { old: "", new: "" },
  // "59": { old: "", new: "" },
  // "60": { old: "", new: "" },
  // "61": { old: "", new: "" },
  // "62": { old: "", new: "" },
  // "63": { old: "", new: "" },
  // "64": { old: "", new: "" },
  // "65": { old: "", new: "" },
  // "66": { old: "", new: "" },
  // "67": { old: "", new: "" },
  // "68": { old: "", new: "" },
  // "69": { old: "", new: "" },
  // "70": { old: "", new: "" },
  // "71": { old: "", new: "" },
  // "72": { old: "", new: "" },
  // "73": { old: "", new: "" },
  // "74": { old: "", new: "" },
  // "75": { old: "", new: "" },
  // "76": { old: "", new: "" },
  // "77": { old: "", new: "" },
  // "78": { old: "", new: "" },
  // "79": { old: "", new: "" },
  // "80": { old: "", new: "" },
  // "81": { old: "", new: "" },
  // "82": { old: "", new: "" },
  // "83": { old: "", new: "" },
  // "84": { old: "", new: "" },
  // "85": { old: "", new: "" },
  // "86": { old: "", new: "" },
  // "87": { old: "", new: "" },
  // "88": { old: "", new: "" },
  // "89": { old: "", new: "" },
  // "90": { old: "", new: "" },
  // "91": { old: "", new: "" },
  // "92": { old: "", new: "" },
  // "93": { old: "", new: "" },
  // "94": { old: "", new: "" },
  // "95": { old: "", new: "" },
  // "971": { old: "", new: "" },
  // "972": { old: "", new: "" },
  // "973": { old: "", new: "" },
  // "974": { old: "", new: "" },
  // "975": { old: "", new: "" },
  // "976": { old: "", new: "" },
  // "977": { old: "", new: "" },
  // "978": { old: "", new: "" },
  // "984": { old: "", new: "" },
  // "986": { old: "", new: "" },
  // "987": { old: "", new: "" },
  // "988": { old: "", new: "" },
};

const checkUserAndUpdate = async (
  oldEmail: string,
  newEmail: string
): Promise<AnyBulkWriteOperation | null> => {
  const userToMigrate = await getUserByParams({
    mail: oldEmail,
  });

  const existingUser = await getUserByParams({
    mail: newEmail,
  });

  if (userToMigrate) {
    if (existingUser && !existingUser.verified) {
      await deleteUser(existingUser);

      return {
        updateOne: {
          filter: { _id: userToMigrate._id },
          update: {
            $set: { mail: newEmail },
          },
        },
      };
    }

    if (!existingUser) {
      return {
        updateOne: {
          filter: { _id: userToMigrate._id },
          update: {
            $set: { mail: newEmail },
          },
        },
      };
    }

    await deleteUser(userToMigrate);
  }

  return null;
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const bulkQuery: AnyBulkWriteOperation[] = [];

  if (EMAIL_CHANGE_PER_TERRITORY["00"]) {
    const oldEmail = EMAIL_CHANGE_PER_TERRITORY["00"].old;
    const newEmail = EMAIL_CHANGE_PER_TERRITORY["00"].new;

    const users = await db
      .collection<User>("users")
      .find({ mail: { $regex: oldEmail } })
      .toArray();

    for (const user of users) {
      const query = await checkUserAndUpdate(
        user.mail,
        user.mail.replace(oldEmail, newEmail)
      );

      if (query) {
        bulkQuery.push(query);
      }
    }
  } else {
    for (const departmentCode of FR_DEPARTMENT_CODES) {
      if (EMAIL_CHANGE_PER_TERRITORY[departmentCode]) {
        const oldEmail = EMAIL_CHANGE_PER_TERRITORY[departmentCode].old;
        const newEmail = EMAIL_CHANGE_PER_TERRITORY[departmentCode].new;

        const users = await db
          .collection<User>("users")
          .find({
            mail: { $regex: oldEmail },
            "areas.fr.departments": departmentCode,
          })
          .toArray();

        for (const user of users) {
          const query = await checkUserAndUpdate(
            user.mail,
            user.mail.replace(oldEmail, newEmail)
          );

          if (query) {
            bulkQuery.push(query);
          }
        }
      }
    }
  }

  if (bulkQuery.length) {
    await db.collection("users").bulkWrite(bulkQuery);
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  const bulkQuery: AnyBulkWriteOperation[] = [];

  if (EMAIL_CHANGE_PER_TERRITORY["00"]) {
    const oldEmail = EMAIL_CHANGE_PER_TERRITORY["00"].new;
    const newEmail = EMAIL_CHANGE_PER_TERRITORY["00"].old;

    const users = await db
      .collection<User>("users")
      .find({ mail: { $regex: oldEmail } })
      .toArray();

    for (const user of users) {
      const query = await checkUserAndUpdate(
        user.mail,
        user.mail.replace(oldEmail, newEmail)
      );

      if (query) {
        bulkQuery.push(query);
      }
    }
  } else {
    for (const departmentCode of FR_DEPARTMENT_CODES) {
      if (EMAIL_CHANGE_PER_TERRITORY[departmentCode]) {
        const oldEmail = EMAIL_CHANGE_PER_TERRITORY[departmentCode].new;
        const newEmail = EMAIL_CHANGE_PER_TERRITORY[departmentCode].old;

        const users = await db
          .collection<User>("users")
          .find({
            mail: { $regex: oldEmail },
            "areas.fr.departments": departmentCode,
          })
          .toArray();

        for (const user of users) {
          const query = await checkUserAndUpdate(
            user.mail,
            user.mail.replace(oldEmail, newEmail)
          );

          if (query) {
            bulkQuery.push(query);
          }
        }
      }
    }
  }

  if (bulkQuery.length) {
    await db.collection("users").bulkWrite(bulkQuery);
  }
};
