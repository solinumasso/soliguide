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
import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";

import { AdminSoliguideGuard } from "./guards/admin-soliguide.guard";
import { AuthGuard } from "./guards/auth.guard";
import { CampaignGuard } from "./guards/campaign.guard";
import { LanguageGuard } from "./guards/language.guard";
import { ProGuard } from "./guards/pro.guard";
import { TranslatorSoliguideGuard } from "./guards/translator-soliguide.guard";

import { AideComponent } from "./modules/general/components/aide/aide.component";
import { AideTradComponent } from "./modules/general/components/aide-trad/aide-trad.component";
import { ContactComponent } from "./modules/general/components/contact/contact.component";
import { DevenirBenevoleComponent } from "./modules/general/components/devenir-benevole/devenir-benevole.component";
import { HomeComponent } from "./modules/general/components/home/home.component";
import { NotFoundComponent } from "./modules/general/components/not-found/not-found.component";

import { environment } from "../environments/environment";
import { THEME_CONFIGURATION } from "./models";
import { SolidataComponent } from "./modules/general/components/solidata/solidata.component";
import { SolidataGuard } from "./guards/solidata.guard";

export const routes: Routes = [
  // Redirection to /:lang routes
  {
    path: "",
    redirectTo: THEME_CONFIGURATION.defaultLanguage,
    pathMatch: "full",
  },
  {
    path: "contact",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/contact`,
  },
  {
    path: "devenir-benevole",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/devenir-benevole`,
  },
  {
    path: "aide",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/aide`,
  },
  {
    path: "aide-trad",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/aide-trad`,
  },
  {
    path: "historique",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/historique`,
  },
  {
    path: "search",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/search`,
  },
  {
    path: "admin-place",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/admin-place`,
  },
  {
    path: "manage-place",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/manage-place`,
  },
  {
    path: "fiche",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/fiche`,
  },
  {
    path: "manage-emails",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/manage-emails`,
  },
  {
    path: "admin-users",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/admin-users`,
  },
  {
    path: "organisations",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/organisations`,
  },
  {
    path: "campaign",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/campaign`,
  },
  {
    path: "translations",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/translations`,
  },
  {
    path: "soligare",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/soligare`,
  },
  {
    path: "404",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/404`,
  },

  // Actual routes
  { path: ":lang", component: HomeComponent, canActivate: [LanguageGuard] },
  {
    path: ":lang/solidata/public/:superset",
    component: SolidataComponent,
    canActivate: [LanguageGuard, SolidataGuard],
  },
  {
    path: ":lang/solidata/:superset",
    component: SolidataComponent,
    canActivate: [LanguageGuard, AuthGuard, ProGuard, SolidataGuard],
  },
  {
    path: ":lang/contact",
    component: ContactComponent,
    canActivate: [LanguageGuard],
  },
  {
    path: ":lang/devenir-benevole",
    component: DevenirBenevoleComponent,
    canActivate: [LanguageGuard],
  },
  {
    path: ":lang/aide",
    canActivate: [LanguageGuard, AuthGuard],
    component: AideComponent,
  },
  {
    path: ":lang/aide-trad",
    canActivate: [LanguageGuard, AuthGuard],
    component: AideTradComponent,
  },
  {
    path: ":lang/historique",
    canActivate: [LanguageGuard, AuthGuard, ProGuard],
    loadChildren: () =>
      import("./modules/place-changes/place-changes.module").then(
        (mod) => mod.FicheChangesModule
      ),
  },
  {
    path: ":lang/search",
    canActivate: [LanguageGuard],
    loadChildren: () =>
      import("./modules/search/search.module").then((mod) => mod.SearchModule),
  },
  {
    path: ":lang/admin-place",
    canActivate: [LanguageGuard, AuthGuard, ProGuard],
    loadChildren: () =>
      import("./modules/form-place/form-place.module").then(
        (mod) => mod.FormPlaceModule
      ),
  },
  {
    path: ":lang/fiche",
    canActivate: [LanguageGuard],
    loadChildren: () =>
      import("./modules/place-page/place-page.module").then(
        (mod) => mod.PlacePageModule
      ),
  },
  {
    path: ":lang/manage-place",
    canActivate: [LanguageGuard, AuthGuard, ProGuard],
    loadChildren: () =>
      import("./modules/admin-place/admin-place.module").then(
        (mod) => mod.AdminPlaceModule
      ),
  },
  {
    path: ":lang/admin-users",
    canActivate: [LanguageGuard, AuthGuard, ProGuard],
    loadChildren: () =>
      import("./modules/admin-users/admin-users.module").then(
        (mod) => mod.AdminUsersModule
      ),
  },
  {
    path: ":lang/organisations",
    canActivate: [LanguageGuard, AuthGuard, ProGuard],
    loadChildren: () =>
      import("./modules/admin-organisation/admin-organisation.module").then(
        (mod) => mod.AdminOrganisationModule
      ),
  },
  {
    path: ":lang/campaign",
    canActivate: [LanguageGuard, AuthGuard, ProGuard, CampaignGuard],
    loadChildren: () =>
      import("./modules/campaign/campaign.module").then(
        (mod) => mod.CampaignModule
      ),
  },
  {
    path: ":lang/translations",
    canActivate: [LanguageGuard, AuthGuard, TranslatorSoliguideGuard],
    loadChildren: () =>
      import("./modules/translations/translations.module").then(
        (mod) => mod.TranslationsModule
      ),
  },
  {
    path: ":lang/soligare",
    canActivate: [AdminSoliguideGuard],
    loadChildren: () =>
      import("./modules/soligare/soligare.module").then(
        (mod) => mod.SoligareModule
      ),
  },

  {
    path: ":lang/poc",
    loadChildren: () =>
      import("./modules/poc/poc.module").then((mod) => mod.PocModule),
  },

  // Error routes
  {
    path: ":lang/404",
    canActivate: [LanguageGuard],
    component: NotFoundComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  onSameUrlNavigation: "reload",
  enableTracing: environment.enableTracing,
  scrollPositionRestoration: "top",
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {} // skipcq: JS-0327
