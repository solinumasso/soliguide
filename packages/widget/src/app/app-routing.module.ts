import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GcuComponent } from "./modules/general/components/gcu/gcu.component";
import { HelpSearchComponent } from "./modules/general/components/help-search/help-search.component";
import { NotFoundComponent } from "./modules/general/components/not-found/not-found.component";
import { PersonalDataProtectionAgreementComponent } from "./modules/general/components/personal-data-protection-agreement/personal-data-protection-agreement.component";

import { IframeFormComponent } from "./modules/iframe-generator/components/iframe-form/iframe-form.component";

const routes: Routes = [
  {
    path: "",
    component: IframeFormComponent,
  },
  {
    path: "cgu",
    component: GcuComponent,
  },
  {
    path: "help-search",
    component: HelpSearchComponent,
  },
  {
    path: "accord-protection-donnees",
    component: PersonalDataProtectionAgreementComponent,
  },
  {
    path: "search",
    loadChildren: () =>
      import("./modules/search/search.module").then((mod) => mod.SearchModule),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
