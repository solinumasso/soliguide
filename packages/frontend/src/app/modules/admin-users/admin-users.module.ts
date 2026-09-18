import { AdminPlaceSharedModule } from "./../admin-place-shared/admin-place-shared.module";
import { ManageCommonModule } from "./../manage-common/manage-common.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { AdminUsersRoutingModule } from "./admin-users-routing.module";
import { AdminUserComponent } from "./components/admin-user/admin-user.component";
import { ManageApiUsersComponent } from "./components/manage-api-users/manage-api-users.component";
import { ManageUsersComponent } from "./components/manage-users/manage-users.component";
import { AdminUsersService } from "./services/admin-users.service";
import { PlaceModule } from "../place/place.module";
import { SharedModule } from "../shared/shared.module";
import { UsersModule } from "../users/users.module";
import { FormPhoneInputComponent } from "../shared/components/form-phone/form-phone-input.component";

@NgModule({
  declarations: [
    AdminUserComponent,
    ManageApiUsersComponent,
    ManageUsersComponent,
  ],
  imports: [
    AdminPlaceSharedModule,
    ManageCommonModule,
    AdminUsersRoutingModule,
    ClipboardModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    PlaceModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UsersModule,
    FormPhoneInputComponent,
  ],
  providers: [AdminUsersService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminUsersModule {}
