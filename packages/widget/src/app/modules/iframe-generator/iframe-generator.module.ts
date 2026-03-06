import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { AppearanceFormComponent } from "./components/appearance-form/appearance-form.component";
import { CategoriesFormComponent } from "./components/categories-form/categories-form.component";
import { GcuFormComponent } from "./components/gcu-form/gcu-form.component";
import { IframeFormComponent } from "./components/iframe-form/iframe-form.component";
import { IntroFormComponent } from "./components/intro-form/intro-form.component";
import { SearchLocationAutocompleteComponent } from "./components/locations-form/search-location-autocomplete/search-location-autocomplete.component";
import { LocationsFormComponent } from "./components/locations-form/locations-form.component";
import { ModalitiesFormComponent } from "./components/modalities-form/modalities-form.component";
import { PublicsDropdownComponent } from "./components/publics-form/publics-dropdown/publics-dropdown.component";
import { PublicsFormComponent } from "./components/publics-form/publics-form.component";
import { UriDisplayComponent } from "./components/uri-display/uri-display.component";

import { SearchModule } from "../search/search.module";
import { SharedModule } from "../shared/shared.module";
import { UsersFormComponent } from "./components/users-form/users-form.component";

@NgModule({
  declarations: [
    AppearanceFormComponent,
    CategoriesFormComponent,
    GcuFormComponent,
    IframeFormComponent,
    IntroFormComponent,
    LocationsFormComponent,
    ModalitiesFormComponent,
    PublicsDropdownComponent,
    PublicsFormComponent,
    SearchLocationAutocompleteComponent,
    UriDisplayComponent,
    UsersFormComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([]),
    SearchModule,
    SharedModule,
    TranslateModule,
  ],
})
export class IframeGeneratorModule {}
