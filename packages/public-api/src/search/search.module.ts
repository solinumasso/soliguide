import { Module } from "@nestjs/common";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { PLACES_REPOSITORY } from "./repositories/places.repository";
import { PlacesSearchQueryBuilder } from "./repositories/mongo/query-builder/search.query-builder";
import { SearchResultMapper } from "./repositories/mongo/result-mapper/search.result-mapper";
import { PlacesMongoRepository } from "./repositories/mongo/places.mongo.repository";
import { SearchAuthResolver } from "./auth/search-auth.resolver";
import { SearchAuthGuard } from "./auth/search-auth.guard";

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchAuthResolver,
    SearchAuthGuard,
    PlacesSearchQueryBuilder,
    SearchResultMapper,
    {
      provide: PLACES_REPOSITORY,
      useClass: PlacesMongoRepository,
    },
  ],
})
export class SearchModule {}
