import { SetMetadata } from "@nestjs/common";

export const CACHE_PREFIX_KEY = "CACHE_PREFIX_KEY" as const;

export const UseCacheManager = (prefix: string, conditionalParam?: string) => {
  return SetMetadata(CACHE_PREFIX_KEY, { prefix, conditionalParam });
};
