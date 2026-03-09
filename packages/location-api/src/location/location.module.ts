import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AutocompleteController } from "./controllers/autocomplete/autocomplete.controller";
import { ReverseController } from "./controllers/reverse/reverse.controller";
import { FrenchAddressService, DepartmentsAndRegionsService } from "./services";
import { HereApiService } from "./services/here-api/here-api.service";
import { CacheManagerService } from "../cache-manager/services/cache-manager.service";

@Module({
  controllers: [AutocompleteController, ReverseController],
  imports: [HttpModule],
  providers: [
    FrenchAddressService,
    DepartmentsAndRegionsService,
    HereApiService,
    CacheManagerService,
  ],
})
export class LocationModule {}
