import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { ManageUsersComponent } from "./components/manage-users/manage-users.component";
import { ManageApiUsersComponent } from "./components/manage-api-users/manage-api-users.component";
import { AdminUserComponent } from "./components/admin-user/admin-user.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";

export const adminUsersRoutes: Routes = [
  {
    path: "",
    redirectTo: "manage",
    pathMatch: "full",
  },
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManageUsersComponent,
  },
  {
    path: "manage-api-users",
    canActivate: [AdminSoliguideGuard],
    component: ManageApiUsersComponent,
  },
  {
    path: ":id",
    component: AdminUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminUsersRoutes)],
  exports: [RouterModule],
})
export class AdminUsersRoutingModule {} // skipcq: JS-0327
