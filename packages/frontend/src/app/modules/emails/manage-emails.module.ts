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
import { ManageCommonModule } from "../manage-common/manage-common.module";
import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { EmailsRoutingModule } from "./manage-emails-routing.module";

import { EditEmailTemplatesComponent } from "./components/edit-email-templates/edit-email-templates.component";
import { ManageEmailTemplatesComponent } from "./components/manage-email-templates/manage-email-templates.component";
import { ManageEmailsComponent } from "./components/manage-emails/manage-emails.component";
import { ViewEmailComponent } from "./components/view-email/view-email.component";

import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    EditEmailTemplatesComponent,
    ManageEmailsComponent,
    ManageEmailTemplatesComponent,
    ViewEmailComponent,
  ],
  imports: [
    CKEditorModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    EmailsRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    ManageCommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailsModule {} // skipcq: JS-0327
