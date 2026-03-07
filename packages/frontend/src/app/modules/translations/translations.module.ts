import { ManageCommonModule } from "./../manage-common/manage-common.module";
import { SharedModule } from "./../shared/shared.module";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PlaceModule } from "../place/place.module";
import { TranslationsRoutingModule } from "./translations-routing.module";
import { TranslateModule } from "@ngx-translate/core";

import { TranslationService } from "./services/translation.service";

import { ManageTradFieldsComponent } from "./components/manage-trad-fields/manage-trad-fields.component";
import { ManageTradPlacesComponent } from "./components/manage-trad-places/manage-trad-places.component";
import { EditTradFieldComponent } from "./components/edit-trad-field/edit-trad-field.component";

@NgModule({
  declarations: [
    EditTradFieldComponent,
    ManageTradFieldsComponent,
    ManageTradPlacesComponent,
  ],
  exports: [],
  imports: [
    CKEditorModule,
    SharedModule,
    ManageCommonModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    PlaceModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbModule,
    TranslationsRoutingModule,
  ],
  providers: [TranslationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TranslationsModule {} // skipcq: JS-0327
