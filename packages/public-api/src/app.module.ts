import { Module } from "@nestjs/common";

import { SearchModule } from "./search/search.module";

@Module({
  imports: [SearchModule],
})
export class AppModule {}
