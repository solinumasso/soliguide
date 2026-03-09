import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { FormSingleServiceFicheComponent } from "./single-service.component";
import { CategoryTranslateKeyPipe } from "../../../../shared/pipes";

import { SERVICE_MOCK } from "../../../../../../../mocks/SERVICE.mock";

describe("FormSingleServiceFicheComponent", () => {
  let component: FormSingleServiceFicheComponent;
  let fixture: ComponentFixture<FormSingleServiceFicheComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormSingleServiceFicheComponent, CategoryTranslateKeyPipe],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleServiceFicheComponent);
    component = fixture.componentInstance;
    component.service = SERVICE_MOCK;
    component.serviceIndex = 0;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
