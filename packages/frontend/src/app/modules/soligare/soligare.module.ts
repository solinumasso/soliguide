import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbPaginationModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";

import { SoligareRoutingModule } from "./soligare-routing.module";
import { SoligarePairingComponent } from "./components/soligare-pairing/soligare-pairing.component";
import { SearchModule } from "../search/search.module";
import { SharedModule } from "../shared/shared.module";
import { ManageCommonModule } from "../manage-common/manage-common.module";
import { SoligareSearchService } from "./services/soligare-search.service";
import { SoligareMatchingComponent } from "./components/soligare-matching/soligare-matching.component";
import { PlaceService } from "../place/services/place.service";
import { CurrentLanguageService } from "../general/services/current-language.service";
import { PlaceModule } from "../place/place.module";
import { SoligarePairService } from "./services/soligare-pair.service";
import { AvailableSourceService } from "./services/available-source.service";
import { SelectAvailableSourceComponent } from "./components/select-sources/select-available-source.component";
import { SoligarePreviewComponent } from "./components/soligare-preview/soligare-preview.component";
import { SearchMapComponent } from "../place/standalone-components/search-map/search-map.component";
import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { SearchCategoryAutocompleteComponent } from "../shared/components/search-category-autocomplete/search-category-autocomplete.component";

@NgModule({
  declarations: [
    SelectAvailableSourceComponent,
    SoligarePairingComponent,
    SoligareMatchingComponent,
    SoligarePreviewComponent,
  ],
  providers: [
    AvailableSourceService,
    CurrentLanguageService,
    PlaceService,
    SoligarePairService,
    SoligareSearchService,
  ],
  imports: [
    CommonModule,
    SoligareRoutingModule,
    SearchModule,
    SharedModule,
    SearchCategoryAutocompleteComponent,
    SearchMapComponent,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    DisplayHorairesComponent,
    TranslateModule,
    ManageCommonModule,
    PlaceModule,
  ],
})
export class SoligareModule {}
