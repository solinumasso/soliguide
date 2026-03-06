import { DateProxyPipe } from "./date-proxy.pipe";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { TestBed } from "@angular/core/testing";
import { SupportedLanguagesCode } from "@soliguide/common";

import { registerLocales } from "../../../shared";
import { CurrentLanguageService } from "../../general/services/current-language.service";

describe("🌍 DateProxyPipe", () => {
  let pipe: DateProxyPipe;
  let translateService: TranslateService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: SupportedLanguagesCode.FR,
        }),
      ],
      providers: [TranslateService, CurrentLanguageService],
    });

    translateService = TestBed.inject(TranslateService);
    translateService.currentLang = SupportedLanguagesCode.FR;

    pipe = new DateProxyPipe(translateService);
  });

  it("should format date in shortDate format", () => {
    translateService.currentLang = SupportedLanguagesCode.FR;
    const result = pipe.transform(new Date(2023, 7, 16), "shortDate");
    expect(result).toEqual("16/08/2023");
  });

  it("should format date in shortDate format in Russian", () => {
    translateService.currentLang = SupportedLanguagesCode.RU;
    const result = pipe.transform(new Date(2023, 7, 16), "shortDate");
    expect(result).toEqual("16.08.2023");
  });

  it("should format date in shortDate format in English", () => {
    translateService.currentLang = SupportedLanguagesCode.EN;
    const result = pipe.transform(new Date(2023, 7, 16), "shortDate");
    expect(result).toEqual("8/16/23");
  });
});
