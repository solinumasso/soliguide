/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { SearchCategoryAutocompleteComponent } from "./components/search-category-autocomplete/search-category-autocomplete.component";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../shared/shared.module";
import { SearchBarService } from "./services/search-bar.service";
import { LocationAutocompleteComponent } from "../shared/components/location-autocomplete/location-autocomplete.component";

@NgModule({
  declarations: [SearchBarComponent, SearchCategoryAutocompleteComponent],
  exports: [SearchBarComponent, SearchCategoryAutocompleteComponent],
  imports: [
    FontAwesomeModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    LocationAutocompleteComponent,
  ],
  providers: [SearchBarService],
})
export class SearchBarModule {}
