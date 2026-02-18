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
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";
import { FA_ICONS } from "../../shared/constants/FA_ICONS.const";
import { DisplayTerritoriesComponent } from "./components/display-territories/display-territories.component";
import { SelectCategoryComponent } from "./components/select-category/select-category.component";
import { SelectTerritoriesComponent } from "./components/select-territories/select-territories.component";
import { CleanStrDirective } from "./directives/clean-str.directive";
import { DateFrDirective } from "./directives/date-fr.directive";
import { DigitOnlyDirective } from "./directives/digit-only.directive";
import { LastLoginBadgeDirective } from "./directives/last-login-badge.directive";
import {
  CategoryTranslateKeyPipe,
  DecodePunycodeEmailPipe,
  FormatBigNumberPipe,
  HtmlToTextPipe,
  KmToMeters,
  LimitToPipe,
  ReadableParcoursPipe,
  SafeHtmlPipe,
  UcFirstPipe,
  UserFullNamePipe,
  DateProxyPipe,
} from "./pipes";
import { PrintService, LocationService } from "./services";
import { TextDirectionDirective } from "./directives";
import { DisplaySourcesComponent } from "./components/display-sources/display-sources.component";
import { NgxTranslateI18nextAdapter } from "./services/ngx-translate-i18next-adaptater.service";

@NgModule({
  declarations: [
    CategoryTranslateKeyPipe,
    CleanStrDirective,
    DateFrDirective,
    DecodePunycodeEmailPipe,
    DigitOnlyDirective,
    FormatBigNumberPipe,
    HtmlToTextPipe,
    KmToMeters,
    LastLoginBadgeDirective,
    LimitToPipe,
    ReadableParcoursPipe,
    SafeHtmlPipe,
    SelectTerritoriesComponent,
    SelectCategoryComponent,
    UcFirstPipe,
    UserFullNamePipe,
    DisplayTerritoriesComponent,
    DateProxyPipe,
    TextDirectionDirective,
    DisplaySourcesComponent,
  ],
  exports: [
    CategoryTranslateKeyPipe,
    CleanStrDirective,
    DateFrDirective,
    DecodePunycodeEmailPipe,
    DigitOnlyDirective,
    FormatBigNumberPipe,
    HtmlToTextPipe,
    KmToMeters,
    LastLoginBadgeDirective,
    LimitToPipe,
    ReadableParcoursPipe,
    SafeHtmlPipe,
    SelectTerritoriesComponent,
    SelectCategoryComponent,
    UcFirstPipe,
    UserFullNamePipe,
    DisplayTerritoriesComponent,
    DateProxyPipe,
    TextDirectionDirective,
    DisplaySourcesComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    TranslateModule,
  ],
  providers: [PrintService, LocationService, NgxTranslateI18nextAdapter],
})
export class SharedModule {
  constructor(private readonly library: FaIconLibrary) {
    this.library.addIcons(...FA_ICONS);
  }
}
