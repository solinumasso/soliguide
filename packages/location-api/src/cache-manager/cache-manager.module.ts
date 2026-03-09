import { CacheModule } from "@nestjs/cache-manager";
import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheManagerService } from "./services/cache-manager.service";
import { CacheManagerInterceptor } from "./cache-manager.interceptor";

@Module({
  providers: [CacheManagerService, CacheManagerInterceptor],
  exports: [CacheManagerService, CacheManagerInterceptor, CacheModule],
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>("CACHE_TTL"),
      }),
    }),
  ],
})
export class CacheManagerModule implements OnModuleInit {
  constructor(private readonly cacheManagerService: CacheManagerService) {}

  async onModuleInit() {
    if (!CacheManagerModule.hasInitialized) {
      CacheManagerModule.hasInitialized = true;
      await this.cacheManagerService.flushCache();
    }
  }

  private static hasInitialized = false;
}
