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
import { ViewEmailComponent } from "./components/view-email/view-email.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ManageEmailsComponent } from "./components/manage-emails/manage-emails.component";
import { EditEmailTemplatesComponent } from "./components/edit-email-templates/edit-email-templates.component";
import { ManageEmailTemplatesComponent } from "./components/manage-email-templates/manage-email-templates.component";

export const emailingRoutes: Routes = [
  {
    path: "edit-email-templates/:territory",
    component: EditEmailTemplatesComponent,
  },
  {
    path: "templates",
    component: ManageEmailTemplatesComponent,
  },
  {
    path: "search",
    component: ManageEmailsComponent,
  },
  {
    path: "view-email/:id",
    component: ViewEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(emailingRoutes)],
  exports: [RouterModule],
})
export class EmailsRoutingModule {} // skipcq: JS-0327
