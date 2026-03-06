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
