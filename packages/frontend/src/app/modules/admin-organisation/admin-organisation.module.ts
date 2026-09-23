import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { AddPlaceToOrgaComponent } from "./components/add-place-to-orga/add-place-to-orga.component";
import { AdminOrganisationComponent } from "./components/admin-organisation/admin-organisation.component";
import { FormOrganisationComponent } from "./components/form-organisation/form-organisation.component";
import { InviteMemberComponent } from "./components/invite-member/invite-member.component";
import { ListInvitationsComponent } from "./components/list-invitations/list-invitations.component";
import { ListPlacesComponent } from "./components/list-places/list-places.component";
import { ListUserComponent } from "./components/list-user/list-user.component";
import { ManageOrganisationsComponent } from "./components/manage-organisations/manage-organisations.component";
import { ListRolesComponent } from "./components/manage-roles/list-roles/list-roles.component";
import { ManageRolesComponent } from "./components/manage-roles/manage-roles.component";
import { OrganizationUpdateCampaignBannerComponent } from "./components/organization-update-campaign-banner/organization-update-campaign-banner.component";
import { RemovePlaceComponent } from "./components/remove-place/remove-place.component";

import { AdminOrganisationRoutingModule } from "./admin-organisation-routing.module";

import { AdminPlaceSharedModule } from "../admin-place-shared/admin-place-shared.module";

import { ManageCommonModule } from "../manage-common/manage-common.module";

import { PlaceModule } from "../place/place.module";

import { SharedModule } from "../shared/shared.module";

import { UsersModule } from "../users/users.module";
import { FormPhoneInputComponent } from "../shared/components/form-phone/form-phone-input.component";
import { FormatInternationalPhoneNumberPipe } from "../shared";

@NgModule({
  declarations: [
    AddPlaceToOrgaComponent,
    AdminOrganisationComponent,
    FormOrganisationComponent,
    InviteMemberComponent,
    ListInvitationsComponent,
    ListPlacesComponent,
    ListRolesComponent,
    ListUserComponent,
    ManageOrganisationsComponent,
    ManageRolesComponent,
    OrganizationUpdateCampaignBannerComponent,
    RemovePlaceComponent,
  ],
  exports: [RemovePlaceComponent],
  imports: [
    AdminOrganisationRoutingModule,
    AdminPlaceSharedModule,
    CKEditorModule,
    ClipboardModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ManageCommonModule,
    NgbModule,
    PlaceModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UsersModule,
    FormatInternationalPhoneNumberPipe,
    FormPhoneInputComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminOrganisationModule {}
