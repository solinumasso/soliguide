import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MyAccountComponent } from "./components/my-account/my-account.component";
import { LoginComponent } from "./components/login/login.component";
import { PwdForgotComponent } from "./components/pwd-forgot/pwd-forgot.component";
import { PwdResetComponent } from "./components/pwd-reset/pwd-reset.component";
import { SignupComponent } from "./components/signup/signup.component";
import { SignupTradComponent } from "./components/signup-trad/signup-trad.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { AuthGuard } from "../../guards/auth.guard";
import { LanguageGuard } from "../../guards/language.guard";
import { NotAuthGuard } from "../../guards/not-logged.guard";
import { THEME_CONFIGURATION } from "../../models";
import { ProCreateAccountComponent } from "./components/pro-create-account/pro-create-account.component";

export const manageRoutes: Routes = [
  // Redirects to prefixed routes
  {
    path: "connexion",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/connexion`,
  },
  {
    path: "forgot-password",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/forgot-password`,
  },
  {
    path: "user/my-account",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/user/my-account`,
  },
  {
    path: "register",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/register`,
  },
  {
    path: "register/:idInvitation",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/register/:idInvitation`,
  },
  {
    path: "register-trad",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/register-trad`,
  },
  {
    path: "reset-password/:resetTokenPassword",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/reset-password/:resetTokenPassword`,
  },
  {
    path: ":lang/connexion",
    component: LoginComponent,
    canActivate: [LanguageGuard, NotAuthGuard],
  },
  {
    path: ":lang/create-pro-account",
    component: ProCreateAccountComponent,
    canActivate: [LanguageGuard, NotAuthGuard],
  },
  {
    path: ":lang/forgot-password",
    component: PwdForgotComponent,
    canActivate: [LanguageGuard],
  },
  {
    path: ":lang/user/my-account",
    component: MyAccountComponent,
    canActivate: [LanguageGuard, AuthGuard],
  },
  {
    path: ":lang/register",
    component: SignupComponent,
    canActivate: [LanguageGuard, AuthGuard, AdminSoliguideGuard],
  },
  {
    path: ":lang/register/:idInvitation",
    component: SignupComponent,
    canActivate: [LanguageGuard, NotAuthGuard],
  },
  {
    path: ":lang/register-trad",
    component: SignupTradComponent,
    canActivate: [LanguageGuard, NotAuthGuard],
  },
  {
    path: ":lang/reset-password/:resetTokenPassword",
    component: PwdResetComponent,
    canActivate: [LanguageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(manageRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {} // skipcq: JS-0327
