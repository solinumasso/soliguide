import { NgModule } from "@angular/core";
import { Routes, RouterModule, ExtraOptions } from "@angular/router";

import { LanguageGuard } from "./guards/language.guard";

import { ContactComponent } from "./modules/general/components/contact/contact.component";
import { DevenirBenevoleComponent } from "./modules/general/components/devenir-benevole/devenir-benevole.component";
import { HomeComponent } from "./modules/general/components/home/home.component";
import { NotFoundComponent } from "./modules/general/components/not-found/not-found.component";

import { environment } from "../environments/environment";
import { THEME_CONFIGURATION } from "./models";
import { SolidataMaintenanceComponent } from "./modules/general/components/solidata-maintenance/solidata-maintenance.component";

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
    path: "search",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/search`,
  },
  {
    path: "fiche",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/fiche`,
  },
  {
    path: "404",
    redirectTo: `${THEME_CONFIGURATION.defaultLanguage}/404`,
  },

  // Actual routes
  { path: ":lang", component: HomeComponent, canActivate: [LanguageGuard] },
  {
    path: ":lang/solidata",
    component: SolidataMaintenanceComponent,
    canActivate: [LanguageGuard],
    children: [{ path: "**", component: SolidataMaintenanceComponent }],
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
    path: ":lang/search",
    canActivate: [LanguageGuard],
    loadChildren: () =>
      import("./modules/search/search.module").then((mod) => mod.SearchModule),
  },
  {
    path: ":lang/fiche",
    canActivate: [LanguageGuard],
    loadChildren: () =>
      import("./modules/place-page/place-page.module").then(
        (mod) => mod.PlacePageModule
      ),
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
