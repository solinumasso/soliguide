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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from "@nestjs/testing";
import { CacheManagerService } from "./cache-manager.service";
import { CacheModule } from "@nestjs/cache-manager";
import { createHash } from "crypto";
import { CachePrefix } from "../enums";

describe("CacheManagerService", () => {
  let service: CacheManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheManagerService],
      imports: [
        CacheModule.register({
          ttl: 36000,
          max: 500,
          isGlobal: true,
        }),
      ],
    }).compile();

    service = module.get<CacheManagerService>(CacheManagerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("get and set cache element", () => {
    it("should set & return cached data", async () => {
      const mockData = { foo: "bar" };
      await service.setCachedData("test-key", mockData);
      const result = await service.getCachedData("test-key");
      expect(result).toEqual(mockData);
    });

    it("should return undefined if data is not in cache", async () => {
      const result = await service.getCachedData("non-existxxxxent-key");
      expect(result).toBeNull();
    });
  });

  describe("generateCacheKey", () => {
    it("should generate a valid cache key", () => {
      const context = CachePrefix.LOCATION_AUTOCOMPLETE_ADDRESSES_ONLY;
      const params = { id: 1, name: "test" };
      const expectedParamString = `${context}-${JSON.stringify(params)}`;
      const expectedHash = createHash("sha1")
        .update(expectedParamString)
        .digest("hex");

      const result = service.generateCacheKey(context, params);

      expect(result).toEqual(expectedHash);
    });

    it("should generate different keys for different contexts", () => {
      const params = { id: 1 };
      const key1 = service.generateCacheKey(
        CachePrefix.LOCATION_AUTOCOMPLETE_ADDRESSES_ONLY,
        params
      );
      const key2 = service.generateCacheKey("xx" as any, params);
      expect(key1).not.toEqual(key2);
    });

    it("should generate different keys for different params", () => {
      const key1 = service.generateCacheKey(
        CachePrefix.LOCATION_AUTOCOMPLETE_ADDRESSES_ONLY,
        {
          id: 1,
        }
      );
      const key2 = service.generateCacheKey(
        CachePrefix.LOCATION_AUTOCOMPLETE_ADDRESSES_ONLY,
        {
          id: 2,
        }
      );
      expect(key1).not.toEqual(key2);
    });
  });
});
