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
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient,
  HttpClientJsonpModule,
} from "@angular/common/http";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  APP_INITIALIZER,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CountUpModule } from "ngx-countup";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { ServerErrorInterceptor } from "./interceptors/server-error.interceptor";

import { GeneralModule } from "./modules/general/general.module";
import { StaticPagesModule } from "./modules/static-pages/static-pages.module";
import { SharedModule } from "./modules/shared/shared.module";
import { UsersModule } from "./modules/users/users.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";

import { CustomLoaderTranslate, registerLocales } from "./shared";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { THEME_CONFIGURATION } from "./models";
import { firstValueFrom } from "rxjs";

const disableAnimations =
  !("animate" in document.documentElement) ||
  (navigator && /iPhone OS (8|9|10|11|12|13)_/.test(navigator.userAgent));

registerLocales();

export function initializeTranslate(translate: TranslateService) {
  return async () => {
    const defaultLanguage = THEME_CONFIGURATION.defaultLanguage;
    translate.setDefaultLang(defaultLanguage);
    return await firstValueFrom(translate.use(defaultLanguage));
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule.withConfig({ disableAnimations }),
    BrowserModule,
    CommonModule,
    CountUpModule,
    FontAwesomeModule,
    FormsModule,
    GeneralModule,
    HttpClientJsonpModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    StaticPagesModule,
    SharedModule,
    AnalyticsModule,
    ToastrModule.forRoot({
      enableHtml: true,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      progressAnimation: "increasing",
      progressBar: true,
      timeOut: 6000,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoaderTranslate,
        deps: [HttpClient],
      },
    }),
    UsersModule, // TODO: migrate to lazy loading router
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslate,
      deps: [TranslateService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
