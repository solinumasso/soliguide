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
import mongoose from "mongoose";

import { logger } from "../../general/logger";
import { CONFIG } from "../../_models";

mongoose.set("strictQuery", true);

console.log(CONFIG.MONGODB_URI);

// Create the database connection
mongoose.connect(CONFIG.MONGODB_URI, {
  maxIdleTimeMS: 50000,
  serverSelectionTimeoutMS: 50000,
});

// When successfully connected
mongoose.connection.on("connected", () => {
  try {
    mongoose.connection.db?.listCollections();
  } catch (err) {
    logger.error({ err });
  }
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  logger.info(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info(
    "Mongoose default connection disconnected through app termination"
  );
  process.exit(0);
});

export const mongooseConnection = mongoose.connection;
