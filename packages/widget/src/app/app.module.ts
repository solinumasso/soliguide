import { CommonModule } from "@angular/common";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";

import { DEFAULT_LANG } from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { GeneralModule } from "./modules/general/general.module";
import { IframeGeneratorModule } from "./modules/iframe-generator/iframe-generator.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { SharedModule } from "./modules/shared/shared.module";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { translateFactory, CustomLoaderTranslate } from "./shared";

import { ThemeService } from "./services/theme.service";
import { ServerErrorInterceptor } from "./interceptors/server-interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AnalyticsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    FontAwesomeModule,
    GeneralModule,
    HttpClientModule,
    IframeGeneratorModule,
    NgbModule,
    SharedModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoaderTranslate,
        deps: [HttpClient],
      },
      defaultLanguage: DEFAULT_LANG,
    }),
  ],
  providers: [
    {
      useClass: ServerErrorInterceptor,
      multi: true,
      provide: HTTP_INTERCEPTORS,
    },
    ThemeService,
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [TranslateService],
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
