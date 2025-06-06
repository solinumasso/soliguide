/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheManagerService } from "./services/cache-manager.service";
import { CacheManagerInterceptor } from "./cache-manager.interceptor";
import KeyvRedis, { RedisClientOptions } from "@keyv/redis";

@Module({
  providers: [CacheManagerService, CacheManagerInterceptor],
  exports: [CacheManagerService, CacheManagerInterceptor, CacheModule],
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const ttl = configService.get<number>("REDIS_TTL");
        const redisUrl = configService.get<string>("REDIS_URL");

        if (redisUrl) {
          const redisOptions: RedisClientOptions = {
            url: redisUrl,
            socket: {
              connectTimeout: 10000,
              keepAlive: 30000,
              reconnectStrategy: (retries: number) => {
                if (retries > 5) return false;
                return Math.min(retries * 100, 3000);
              },
            },
            disableOfflineQueue: true,
            pingInterval: 0,
          };

          // KeyvRedis avec options Keyv uniquement
          const keyvRedis = new KeyvRedis(redisOptions, {
            namespace: "cache",
          });
          try {
            return {
              stores: [keyvRedis],
              ttl,
            };
          } catch (error) {
            return {
              ttl,
            };
          }
        }
        return {
          ttl,
        };
      },
    }),
  ],
})
export class CacheManagerModule {}
