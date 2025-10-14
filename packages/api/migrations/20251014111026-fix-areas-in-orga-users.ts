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
import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Replace null value in areas in orga and users by empty array";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  logger.info("Fix organizations for France");
  let value = (
    await db
      .collection("organization")
      .updateMany(
        { "areas.fr.regions": null },
        { $set: { "areas.fr.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.fr.departments": null },
        { $set: { "areas.fr.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.fr.cities": null },
        { $set: { "areas.fr.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} organizations for France`);

  logger.info("Fix users for France");
  value = (
    await db
      .collection("user")
      .updateMany(
        { "areas.fr.regions": null },
        { $set: { "areas.fr.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.fr.departments": null },
        { $set: { "areas.fr.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.fr.cities": null },
        { $set: { "areas.fr.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} users for France`);

  logger.info("Fix organizations for Spain");
  value = (
    await db
      .collection("organization")
      .updateMany(
        { "areas.es.regions": null },
        { $set: { "areas.es.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.es.departments": null },
        { $set: { "areas.es.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.es.cities": null },
        { $set: { "areas.es.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} organizations for Spain`);

  logger.info("Fix users for Spain");
  value = (
    await db
      .collection("user")
      .updateMany(
        { "areas.es.regions": null },
        { $set: { "areas.es.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.es.departments": null },
        { $set: { "areas.es.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.es.cities": null },
        { $set: { "areas.es.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} users for Spain`);

  logger.info("Fix organizations for Andorra");
  value = (
    await db
      .collection("organization")
      .updateMany(
        { "areas.ad.regions": null },
        { $set: { "areas.ad.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.ad.departments": null },
        { $set: { "areas.ad.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("organization")
      .updateMany(
        { "areas.ad.cities": null },
        { $set: { "areas.ad.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} organizations for Andorra`);

  logger.info("Fix users for Andorra");
  value = (
    await db
      .collection("user")
      .updateMany(
        { "areas.ad.regions": null },
        { $set: { "areas.ad.regions": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.ad.departments": null },
        { $set: { "areas.ad.departments": [] } }
      )
  ).modifiedCount;
  value += (
    await db
      .collection("user")
      .updateMany(
        { "areas.ad.cities": null },
        { $set: { "areas.ad.cities": [] } }
      )
  ).modifiedCount;
  logger.info(`Fixed ${value} users for Andorra`);
};

export const down = () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info("No rollback available for this migration");
};
