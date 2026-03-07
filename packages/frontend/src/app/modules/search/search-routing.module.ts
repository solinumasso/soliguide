import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { SearchComponent } from "./components/search/search.component";

import { LanguageGuard } from "../../guards/language.guard";

export const searchRoutes: Routes = [
  {
    path: "",
    canActivate: [LanguageGuard],
    component: SearchComponent,
  },
  {
    path: ":position",
    canActivate: [LanguageGuard],
    component: SearchComponent,
  },
  {
    path: ":position/:category",
    canActivate: [LanguageGuard],
    component: SearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(searchRoutes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {} // skipcq: JS-0327
