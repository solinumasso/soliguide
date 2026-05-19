import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { InviteFormComponent } from "./components/invite-form/invite-form.component";
import { LoginComponent } from "./components/login/login.component";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { PwdForgotComponent } from "./components/pwd-forgot/pwd-forgot.component";
import { PwdResetComponent } from "./components/pwd-reset/pwd-reset.component";
import { SignupComponent } from "./components/signup/signup.component";
import { SignupTradComponent } from "./components/signup-trad/signup-trad.component";
import { UserPasswordFormComponent } from "./components/user-password-form/user-password-form.component";

import { UsersService } from "./services/users.service";
import { AuthService } from "./services/auth.service";

import { UsersRoutingModule } from "./users-routing.module";

import { InviteUserService } from "../admin-organisation/services/invite-user.service";

import { SharedModule } from "../shared/shared.module";
import { FormPhoneInputComponent } from "../shared/components/form-phone/form-phone-input.component";
import { TranslatableLanguageSelectorComponent } from "./components/translatable-language-selector/translatable-language-selector.component";

@NgModule({
  declarations: [
    InviteFormComponent,
    LoginComponent,
    MyAccountComponent,
    PwdResetComponent,
    PwdForgotComponent,
    SignupComponent,
    SignupTradComponent,
    UserPasswordFormComponent,
    TranslatableLanguageSelectorComponent,
  ],
  exports: [InviteFormComponent, TranslatableLanguageSelectorComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    NgbModule,
    UsersRoutingModule,
    FormPhoneInputComponent,
  ],
  providers: [AuthService, InviteUserService, UsersService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersModule {}
