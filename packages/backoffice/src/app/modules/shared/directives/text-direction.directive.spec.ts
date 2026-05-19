import { Component, DebugElement } from "@angular/core";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { CurrentLanguageService } from "../../general/services/current-language.service";
import { TextDirectionDirective } from "./text-direction.directive";
import { SupportedLanguagesCode } from "@soliguide/common";
import { LanguageDirection } from "../../translations/enums";

@Component({
  template: `<div appTextDirection></div>`,
})
class TestComponent {}

describe("TextDirectionDirective", () => {
  let fixture: ComponentFixture<TestComponent>;
  let divEl: DebugElement;
  let currentLanguageService: CurrentLanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, TextDirectionDirective],
    }).compileComponents();

    currentLanguageService = TestBed.inject(CurrentLanguageService);
    fixture = TestBed.createComponent(TestComponent);
    divEl = fixture.debugElement.query(By.css("div"));
  });

  it("Should create TextDirectionDirective", () => {
    const directive = new TextDirectionDirective(divEl, currentLanguageService);
    expect(directive).toBeTruthy();
  });

  it("Should set dir to RTL for arabic language", () => {
    currentLanguageService.setCurrentLanguage(SupportedLanguagesCode.AR);
    fixture.detectChanges();
    expect(currentLanguageService.direction).toStrictEqual(
      LanguageDirection.RTL
    );
    expect(divEl.nativeElement.dir).toStrictEqual(LanguageDirection.RTL);
  });

  it("Should set dir to LTR for english", () => {
    currentLanguageService.setCurrentLanguage(SupportedLanguagesCode.EN);
    fixture.detectChanges();
    expect(currentLanguageService.direction).toStrictEqual(
      LanguageDirection.LTR
    );
    expect(divEl.nativeElement.dir).toStrictEqual(LanguageDirection.LTR);
  });
});
