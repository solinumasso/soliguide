import { HttpClientTestingModule } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { LanguageGuard } from "./language.guard";

import { CurrentLanguageService } from "../modules/general/services/current-language.service";
import { THEME_CONFIGURATION } from "../models";

describe("LanguageGuard", () => {
  let injector: TestBed;
  let languageGuard: LanguageGuard;
  let route: ActivatedRouteSnapshot;
  let currentLanguageService: CurrentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/404`,
            redirectTo: "",
          },
        ]),
        TranslateModule.forRoot({}),
      ],
      providers: [LanguageGuard],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    languageGuard = injector.inject(LanguageGuard);
    route = new ActivatedRouteSnapshot();
    currentLanguageService = injector.inject(CurrentLanguageService);
  });

  it("should return 'true' if the language is supported", () => {
    let index = 0;
    const expectedLanguages = ["fr", "en"];
    currentLanguageService.subscribe((lang) => {
      expect(lang).toStrictEqual(expectedLanguages[index]);
      index++;
    });
    route.params = {
      lang: "en",
    };
    expect(languageGuard.canActivate(route)).toBeTruthy();
    expect(index).toStrictEqual(expectedLanguages.length);
  });

  it("should return 'false' if the language is not supported", () => {
    let languageUpdates = 0;
    route.params = {
      lang: "foo",
    };
    currentLanguageService.subscribe((lang) => {
      expect(lang).toStrictEqual("fr");
      languageUpdates++;
    });
    expect(languageGuard.canActivate(route)).toBeFalsy();
    expect(languageUpdates).toStrictEqual(1);
  });
});
