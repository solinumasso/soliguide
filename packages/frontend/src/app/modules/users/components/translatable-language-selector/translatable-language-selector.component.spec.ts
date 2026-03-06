import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslatableLanguageSelectorComponent } from "./translatable-language-selector.component";
import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { nonEmptyArray } from "../../../../shared";
import { SharedModule } from "../../../shared/shared.module";

describe("TranslatableLanguageSelectorComponent", () => {
  let component: TranslatableLanguageSelectorComponent;
  let fixture: ComponentFixture<TranslatableLanguageSelectorComponent>;

  const form = new FormGroup({
    languages: new FormControl([], [Validators.required, nonEmptyArray]),
  });

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslatableLanguageSelectorComponent],
      imports: [TranslateModule.forRoot({}), SharedModule],
      providers: [{ provide: APP_BASE_HREF, useValue: "/register" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslatableLanguageSelectorComponent);
    component = fixture.componentInstance;

    component.f = form.controls;
    component.submitted = false;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("toggleCheckboxButton", () => {
    it("should add language when not present", () => {
      component.f.languages.setValue([]);
      component.toggleCheckboxButton("FR");

      expect(component.f.languages.value).toContain("FR");
      expect(component.f.languages.value.length).toBe(1);
    });

    it("should remove language when already present", () => {
      component.f.languages.setValue(["FR", "EN"]);
      component.toggleCheckboxButton("FR");

      expect(component.f.languages.value).not.toContain("FR");
      expect(component.f.languages.value).toContain("EN");
      expect(component.f.languages.value.length).toBe(1);
    });

    it("should mark form control as touched and dirty", () => {
      component.toggleCheckboxButton("FR");

      expect(component.f.languages.touched).toBeTruthy();
      expect(component.f.languages.dirty).toBeTruthy();
    });

    it("should call getStringToDisplay after toggle", () => {
      const spy = jest.spyOn(component, "getStringToDisplay");
      component.toggleCheckboxButton("FR");
      expect(spy).toHaveBeenCalled();
    });
  });
});
