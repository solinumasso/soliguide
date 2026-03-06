import { FormOrganisationComponent } from "./components/form-organisation/form-organisation.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminOrganisationComponent } from "./components/admin-organisation/admin-organisation.component";
import { AddPlaceToOrgaComponent } from "./components/add-place-to-orga/add-place-to-orga.component";
import { ManageOrganisationsComponent } from "./components/manage-organisations/manage-organisations.component";
import { InviteMemberComponent } from "./components/invite-member/invite-member.component";

import { AdminSoliguideGuard } from "../../guards/admin-soliguide.guard";
import { CanCreateGuard } from "../../guards/can-create.guard";

export const adminOrganisationRoutes: Routes = [
  {
    path: "",
    redirectTo: "manage",
    pathMatch: "full",
  },
  {
    path: "manage",
    canActivate: [AdminSoliguideGuard],
    component: ManageOrganisationsComponent,
  },
  {
    path: "new",
    canActivate: [AdminSoliguideGuard],
    component: FormOrganisationComponent,
  },
  {
    path: "edit/:id",
    canActivate: [CanCreateGuard],
    component: FormOrganisationComponent,
  },
  {
    path: "ajouter-lieu/:id",
    canActivate: [AdminSoliguideGuard],
    component: AddPlaceToOrgaComponent,
  },
  {
    path: "inviter-membre/:id",
    canActivate: [CanCreateGuard],
    component: InviteMemberComponent,
  },
  {
    path: ":id",
    component: AdminOrganisationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminOrganisationRoutes)],
  exports: [RouterModule],
})
export class AdminOrganisationRoutingModule {} // skipcq: JS-0327
