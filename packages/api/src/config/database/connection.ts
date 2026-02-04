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

const MAX_RETRY_ATTEMPTS = 6;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries
const CONNECTION_TIMEOUT_MS = 5000; // 5 seconds to detect if MongoDB is down

/**
 * @description
 * Creates a Mongoose connection to the database with retry logic.
 * Attempts to connect up to MAX_RETRY_ATTEMPTS times before killing the application.
 * Logs each connection attempt and failure.
 */
export async function connectToDatabase(): Promise<void> {
  let attempt = 0;

  logger.info({
    uri: CONFIG.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials in logs
    maxAttempts: MAX_RETRY_ATTEMPTS,
    timeoutMs: CONNECTION_TIMEOUT_MS
  }, "Démarrage de la connexion MongoDB");

  while (attempt < MAX_RETRY_ATTEMPTS) {
    attempt++;

    try {
      logger.info(`Tentative de connexion MongoDB (${attempt}/${MAX_RETRY_ATTEMPTS})...`);

      await mongoose.connect(CONFIG.MONGODB_URI, {
        maxIdleTimeMS: 50000,
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS,
      });

      // Test the connection with a real operation
      // This ensures MongoDB is actually responding to queries, not just accepting connections
      logger.info("✓ Connexion MongoDB établie, test de la connexion...");
      await mongoose.connection.db?.admin().ping();

      logger.info("✓ Connexion MongoDB vérifiée avec succès");

      return; // Success - exit the function

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const isConnectionRefused = errorMessage.includes('ECONNREFUSED') || errorMessage.includes('MongoServerSelectionError');

      logger.error(
        {
          err,
          attempt,
          maxAttempts: MAX_RETRY_ATTEMPTS,
          errorType: isConnectionRefused ? 'CONNECTION_REFUSED' : 'OTHER'
        },
        `❌ Échec de connexion MongoDB (tentative ${attempt}/${MAX_RETRY_ATTEMPTS})${isConnectionRefused ? ' - MongoDB semble éteint ou inaccessible' : ''}`
      );

      if (attempt >= MAX_RETRY_ATTEMPTS) {
        logger.fatal(
          {
            err,
            attempts: MAX_RETRY_ATTEMPTS,
            uri: CONFIG.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
          },
          `❌ ERREUR FATALE: Impossible de se connecter à MongoDB après ${MAX_RETRY_ATTEMPTS} tentatives. Vérifiez que MongoDB est démarré (docker compose up -d). Arrêt de l'application.`
        );
        process.exit(1);
      }

      // Wait before retry
      logger.info(`⏳ Nouvelle tentative dans ${RETRY_DELAY_MS / 1000} secondes...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

// If the connection throws an error after successful connection
mongoose.connection.on("error", (err) => {
  logger.error({ err }, "Erreur de connexion MongoDB");
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  logger.warn("Connexion MongoDB déconnectée");
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
