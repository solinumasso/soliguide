import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";

import { FormChooseSubCategoryComponent } from "./choose-subcategory.component";

import { Service } from "../../../../../../../models";
import { Categories, HygieneProductType } from "@soliguide/common";

describe("FormChooseSubCategoryComponent", () => {
  let component: FormChooseSubCategoryComponent;
  let fixture: ComponentFixture<FormChooseSubCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormChooseSubCategoryComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChooseSubCategoryComponent);
    component = fixture.componentInstance;
    component.service = new Service({
      category: Categories.HYGIENE_PRODUCTS,
      categorySpecificFields: {
        hygieneProductType: HygieneProductType.SANITARY_MATERIALS,
      },
    });
    component.serviceIndex = 0;
    component.categorySpecificField = "hygieneProductType";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
