import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { createHash } from "crypto";
import { CachePrefix } from "../enums";

@Injectable()
export class CacheManagerService {
  private readonly logger = new Logger(CacheManagerService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

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

  public async flushCache(): Promise<void> {
    try {
      this.logger.log("Flushing cache...");
      await this.cacheManager.clear();
      this.logger.log("cache flushed successfully");
    } catch (error) {
      this.logger.error("Failed to flush cache", error);
      throw error;
    }
  }
}
