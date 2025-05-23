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
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { CachePrefix } from "../enums";

@Injectable()
export class CacheManagerService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async getCachedData<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  public async setCachedData<T>(key: string, data: T): Promise<void> {
    await this.cacheManager.set(key, data);
  }

  public generateCacheKey(context: CachePrefix, params: unknown): string {
    const paramString = `${context}-${JSON.stringify(params)}`;
    const hash = createHash("sha1").update(paramString).digest("hex");
    return hash;
  }
}
