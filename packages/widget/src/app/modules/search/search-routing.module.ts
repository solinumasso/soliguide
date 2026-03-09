import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { SearchComponent } from "./components/search/search.component";
import { CategoriesGuard } from "./guards/categories.guard";

export const routes: Routes = [
  {
    path: ":widgetId/:lang/:category",
    canActivate: [CategoriesGuard],
    component: SearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
