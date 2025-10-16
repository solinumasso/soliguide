/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ReturnToPlaceComponent } from "./components/_shared/return-to-place/return-to-place.component";
import { FormStartAndEndDateFicheComponent } from "./components/_shared/start-and-date/start-and-end-date.component";
import { FormTypePublicsFicheComponent } from "./components/_shared/type-publics/type-publics.component";
import { UploadDocComponent } from "./components/_shared/upload-doc/upload-doc.component";
import { UploadPhotosComponent } from "./components/_shared/upload-photos/upload-photos.component";

import { AddContactModalComponent } from "./components/edit-contacts-form/add-contact-modal/add-contact-modal.component";
import { EditContactsFormComponent } from "./components/edit-contacts-form/edit-contacts-form.component";

import { FormHorairesComponent } from "./components/horaires/form-horaires.component";

import { HorairesFormTableComponent } from "./components/horaires-form-table/horaires-form-table.component";

import { InfosComponent } from "./components/infos/infos.component";
import { PlaceFormPhonesComponent } from "./components/infos/place-form-phones/place-form-phones.component";

import { FormMenuPlaceComponent } from "./components/menu/menu.component";

import { ModalitiesComponent } from "./components/modalities/modalities.component";

import { ModalitiesFormComponent } from "./components/modalities-form/modalities-form.component";
import { ModalitiesToggleComponent } from "./components/modalities-toggle/modalities-toggle.component";

import { PhotosComponent } from "./components/photos/photos.component";

import { LieuPositionFormComponent } from "./components/place-emplacement-form/lieu-position-form/lieu-position-form.component";
import { JourPassageFormComponent } from "./components/place-emplacement-form/parcours-position-form/jour-passage/jour-passage.component";
import { ParcoursPositionFormComponent } from "./components/place-emplacement-form/parcours-position-form/parcours-position-form.component";
import { FormPointPassageComponent } from "./components/place-emplacement-form/parcours-position-form/point-passage/point-passage.component";
import { PlaceEmplacementFormComponent } from "./components/place-emplacement-form/place-emplacement-form.component";

import { LanguagesFormInputComponent } from "./components/publics-form/languages-form-input/languages-form-input.component";
import { PublicsFormComponent } from "./components/publics-form/publics-form.component";

import { FormServicesFicheComponent } from "./components/services/services.component";
import { FormChooseCategoryFicheComponent } from "./components/services/single-service/choose-category/choose-category.component";
import { ChooseSubCategoryChecklistComponent } from "./components/services/single-service/choose-category/choose-subcategory-checklist/choose-subcategory-checklist.component";
import { FormChooseSubCategoryComponent } from "./components/services/single-service/choose-category/choose-subcategory/choose-subcategory.component";
import { FormSaturationFicheComponent } from "./components/services/single-service/saturation/saturation.component";
import { FormSingleServiceFicheComponent } from "./components/services/single-service/single-service.component";

import { FormServicesComponent } from "./components/services-form/form-services.component";

import { ParentTempInfosFormComponent } from "./components/temp-infos-forms/parent-temp-infos-form/parent-temp-infos-form.component";

import { ForbiddenValidatorDirective } from "./directives/forbidden-words-in-publics.directive";

import { FormPlaceRoutingModule } from "./form-place-routing.module";

import { AdminPlaceContactsService } from "./services/admin-place-contacts.service";
import { AdminPlaceService } from "./services/admin-place.service";
import { UploadService } from "./services/upload.service";

import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";

import { PlaceModule } from "../place/place.module";

import { SharedModule } from "../shared/shared.module";

import { UsersModule } from "../users/users.module";

import { HttpClientJsonpModule } from "@angular/common/http";
import { PendingChangesGuard } from "../../guards/pending-changes.guard";
import { AddressInputComponent } from "./components/_shared/address-input/address-input.component";

import { DisplayHorairesComponent } from "../place/standalone-components/display-horaires/horaires.component";
import { SearchMapComponent } from "../place/standalone-components/search-map/search-map.component";
import { FormatInternationalPhoneNumberPipe } from "../shared";
import { FormIntlPhoneInputComponent } from "../shared/components/form-phone-input/form-intl-phone-input.component";
import { FormPhoneInputComponent } from "../shared/components/form-phone/form-phone-input.component";
import { LocationAutocompleteComponent } from "../shared/components/location-autocomplete/location-autocomplete.component";

@NgModule({
  declarations: [
    AddContactModalComponent,
    EditContactsFormComponent,
    PlaceFormPhonesComponent,
    ForbiddenValidatorDirective,
    FormChooseCategoryFicheComponent,
    FormChooseSubCategoryComponent,
    ChooseSubCategoryChecklistComponent,
    FormHorairesComponent,
    LanguagesFormInputComponent,
    FormMenuPlaceComponent,
    FormPointPassageComponent,
    FormSaturationFicheComponent,
    FormServicesComponent,
    FormServicesFicheComponent,
    FormSingleServiceFicheComponent,
    FormStartAndEndDateFicheComponent,
    FormTypePublicsFicheComponent,
    HorairesFormTableComponent,
    InfosComponent,
    JourPassageFormComponent,
    LieuPositionFormComponent,
    ModalitiesComponent,
    ModalitiesFormComponent,
    ModalitiesToggleComponent,
    ParcoursPositionFormComponent,
    PhotosComponent,
    PlaceEmplacementFormComponent,
    PublicsFormComponent,
    UploadDocComponent,
    UploadPhotosComponent,
    ReturnToPlaceComponent,
    ParentTempInfosFormComponent,
    AddressInputComponent,
  ],
  exports: [
    ParentTempInfosFormComponent,
    FormStartAndEndDateFicheComponent,
    HorairesFormTableComponent,
    LanguagesFormInputComponent,
    FormServicesFicheComponent,
    ModalitiesFormComponent,
    FormSingleServiceFicheComponent,
  ],
  providers: [
    AdminPlaceService,
    AdminPlaceContactsService,
    PendingChangesGuard,
    UploadService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [
    AdminPlaceSharedModule,
    LocationAutocompleteComponent,
    SearchMapComponent,
    CKEditorModule,
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    FormPlaceRoutingModule,
    HttpClientJsonpModule,
    NgbModule,
    PlaceModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UsersModule,
    FormIntlPhoneInputComponent,
    FormatInternationalPhoneNumberPipe,
    FormPhoneInputComponent,
    DisplayHorairesComponent,
  ],
})
export class FormPlaceModule {}
