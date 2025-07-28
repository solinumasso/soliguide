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
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { CampaignNoChangeModalComponent } from "./components/campaign-no-change-modal/campaign-no-change-modal.component";
import { CampaignSourceUpdateComponent } from "./components/campaign-source-update/campaign-source-update.component";

@NgModule({
  declarations: [CampaignNoChangeModalComponent, CampaignSourceUpdateComponent],
  exports: [CampaignNoChangeModalComponent, CampaignSourceUpdateComponent],
  imports: [CommonModule, FontAwesomeModule, NgbModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignSharedModule {} // skipcq: JS-0327
