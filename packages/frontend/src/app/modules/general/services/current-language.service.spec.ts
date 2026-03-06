import { TestBed } from "@angular/core/testing";

import { CurrentLanguageService } from "./current-language.service";
import { LanguageDirection } from "../../translations/enums";
import { SupportedLanguagesCode } from "@soliguide/common";

describe("CurrentLanguageService", () => {
  let service: CurrentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
    service = TestBed.inject(CurrentLanguageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should works with default language", () => {
    expect(service.currentLanguage).toStrictEqual("fr");
    expect(service.routePrefix).toStrictEqual("/fr");
  });

  it("should set current language", () => {
    let index = 0;
    const expectedLanguages = ["fr", "es"];
    service.subscribe((language) => {
      expect(language).toStrictEqual(expectedLanguages[index]);
      expect(service.currentLanguage).toStrictEqual(expectedLanguages[index]);
      expect(service.routePrefix).toStrictEqual("/" + expectedLanguages[index]);
      index++;
    });
    service.setCurrentLanguage("es");
    expect(index).toStrictEqual(expectedLanguages.length);
  });

  it("should change direction", () => {
    service.setCurrentLanguage(SupportedLanguagesCode.ES);
    expect(service.direction).toStrictEqual(LanguageDirection.LTR);
    service.setCurrentLanguage(SupportedLanguagesCode.AR);
    expect(service.direction).toStrictEqual(LanguageDirection.RTL);
  });

  it("should not accept a wrong language", (done) => {
    try {
      service.setCurrentLanguage("it");
      done("Exception not thrown");
    } catch (e) {
      expect(e).toEqual(new Error("BAD_LANGUAGE"));
      done();
    }
  });
});
