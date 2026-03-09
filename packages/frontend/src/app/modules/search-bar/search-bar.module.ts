import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";
import { SearchBarService } from "./services/search-bar.service";
import { LocationAutocompleteComponent } from "../shared/components/location-autocomplete/location-autocomplete.component";
import { SearchCategoryAutocompleteComponent } from "../shared/components/search-category-autocomplete/search-category-autocomplete.component";

@NgModule({
  declarations: [SearchBarComponent],
  exports: [SearchBarComponent],
  imports: [
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    SearchCategoryAutocompleteComponent,
    LocationAutocompleteComponent,
  ],
  providers: [SearchBarService],
})
export class SearchBarModule {}
