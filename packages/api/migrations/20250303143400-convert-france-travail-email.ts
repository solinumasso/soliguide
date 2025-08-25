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

import { logger } from "../src/general/logger";
import {
  FR_DEPARTMENT_CODES,
  type CountryCodes,
  type DepartmentCode,
} from "@soliguide/common";
import { User } from "../src/_models";
import { getUserByParams } from "../src/user/services";
import { deleteUser } from "../src/user/controllers/user-admin.controller";

const message = "Convert email adresses";

const EMAIL_CHANGE_PER_TERRITORY: {
  [key in DepartmentCode<CountryCodes.FR> | "00"]?: {
    new: string;
    old: string;
  };
} = {
  "00": { old: "@pole-emploi.fr", new: "@francetravail.fr" },
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
