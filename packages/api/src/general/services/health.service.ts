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
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CONFIG } from "../../_models";

// Cache the version at module load time (loaded once at startup)
let cachedVersion: string | null = null;

const loadVersion = (): string => {
  try {
    const paths = [
      resolve(__dirname, "../../../package.json"),
      resolve(__dirname, "../../../../package.json"),
    ];

    for (const packageJsonPath of paths) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        if (packageJson.version) {
          return packageJson.version;
        }
      } catch {
        continue;
      }
    }
    return CONFIG.VERSION;
  } catch {
    return CONFIG.VERSION;
  }
};

export const getVersion = (): string => {
  if (cachedVersion === null) {
    cachedVersion = loadVersion();
  }
  return cachedVersion;
};

export const checkMongo = async (): Promise<"up" | "down"> => {
  try {
    if (mongoose?.connection?.readyState !== 1) return "down";
    await mongoose.connection.db?.admin().ping();
    return "up";
  } catch {
    return "down";
  }
};
