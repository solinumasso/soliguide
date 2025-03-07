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

const message = "Convert email adresses CAF";

const EMAIL_CHANGE_PER_TERRITORY: {
  [key in DepartmentCode<CountryCodes.FR> | "00"]?: {
    new: string;
    old: string;
  };
} = {
  "06": { old: "@cafnice.cnafmail.fr", new: "@caf06.caf.fr" },
  "07": { old: "@cafardeche.cnafmail.fr", new: "@caf07.caf.fr" },
  "13": { old: "@cafmarseille.cnafmail.fr", new: "@caf13.caf.fr" },
  "24": { old: "@cafperigueux.caf.fr", new: "@caf24.caf.fr" },
  "31": { old: "@caftoulouse.cnafmail.fr", new: "@caf31.caf.fr" },
  "33": { old: "@cafbordeaux.cnafmail.fr", new: "@caf33.caf.fr" },
  "34": { old: "@cafherault.cnafmail.fr", new: "@caf34.caf.fr" },
  "36": { old: "@cafchateauroux.cnafmail.fr", new: "@caf36.caf.fr" },
  "44": { old: "@cafnantes.cnafmail.fr", new: "@caf44.caf.fr" },
  "63": { old: "@cafclermont-fd.cnafmail.fr", new: "@caf63.caf.fr" },
  "74": { old: "@cafannecy.cnafmail.fr", new: "@caf74.caf.fr" },
  "76": { old: "@cafseine-maritime.cnafmail.fr", new: "@caf76.caf.fr" },
  "78": { old: "@cafyvelines.cnafmail.fr", new: "@caf78.caf.fr" },
  "83": { old: "@caftoulon.cnafmail.fr", new: "@caf83.caf.fr" },
  "92": { old: "@cafnanterre.cnafmail.fr", new: "@caf92.caf.fr" },
  "94": { old: "@cafcreteil.cnafmail.f", new: "@caf94.caf.f" },
  "95": { old: "@cafcergy.cnafmail.fr", new: "@caf95.caf.fr" },
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
