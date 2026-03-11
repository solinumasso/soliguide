import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from '../application/search.service';
import { SearchVersioningInterceptor } from './search-versioning.interceptor';
import { searchResponseDowngradeMapperProviders } from './search.response.mapper';
import { SearchResponseDowngradeMappersStartupValidator } from './search.versioning';
import { VersionMapperService } from './versioning/version-mapper.service';

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchVersioningInterceptor,
    VersionMapperService,
    ...searchResponseDowngradeMapperProviders,
    SearchResponseDowngradeMappersStartupValidator,
  ],
})
export class SearchModule {}
