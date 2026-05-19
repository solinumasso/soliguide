import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { LanguagesFormInputComponent } from "./languages-form-input.component";
import { TranslateModule } from "@ngx-translate/core";

describe("LanguagesFormInputComponent", () => {
  let component: LanguagesFormInputComponent;
  let fixture: ComponentFixture<LanguagesFormInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LanguagesFormInputComponent],
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesFormInputComponent);
    component = fixture.componentInstance;
    component.languages = ["fr", "en", "ru"];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should add lsf to languages", () => {
    component.addLanguage("lsf");
    expect(component.languages.includes("lsf")).toBe(true);
  });
});
