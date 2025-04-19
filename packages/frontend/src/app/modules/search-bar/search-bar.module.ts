import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { SearchCategoryAutocompleteComponent } from "./components/search-category-autocomplete/search-category-autocomplete.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";
import { SearchBarService } from "./services/search-bar.service";
import { LocationAutocompleteComponent } from "../shared/components/location-autocomplete/location-autocomplete.component";

@NgModule({
  declarations: [SearchBarComponent, SearchCategoryAutocompleteComponent],
  exports: [SearchBarComponent, SearchCategoryAutocompleteComponent],
  imports: [
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    LocationAutocompleteComponent,
  ],
  providers: [SearchBarService],
})
export class SearchBarModule {}
