import { DynamicModule, Module } from "@nestjs/common";

import { VersionDefinition } from "./dsl";
import {
  DowngradePipeline,
  UpgradePipeline,
  VERSION_DEFINITIONS,
  VersionPathResolver,
} from "./runtime-pipeline";

@Module({})
export class VersioningModule {
  public static forRoot(definitions: VersionDefinition[]): DynamicModule {
    return {
      exports: [DowngradePipeline, UpgradePipeline, VersionPathResolver],
      module: VersioningModule,
      providers: [
        {
          provide: VERSION_DEFINITIONS,
          useValue: definitions,
        },
        VersionPathResolver,
        UpgradePipeline,
        DowngradePipeline,
      ],
    };
  }
}
