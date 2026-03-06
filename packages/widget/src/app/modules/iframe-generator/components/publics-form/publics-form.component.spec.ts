import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { Categories, WidgetId } from "@soliguide/common";

import { PublicsFormComponent } from "./publics-form.component";

import { WIDGETS } from "../../../../models";

describe("PublicsFormComponent", () => {
  let component: PublicsFormComponent;
  let fixture: ComponentFixture<PublicsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicsFormComponent],
      imports: [FormsModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicsFormComponent);
    component = fixture.componentInstance;
    component.formValue = {
      email: "",
      organizationName: "",
      cities: [],
      departments: [],
      national: true,
      regions: [],
      widgetId: WidgetId.SOLINUM,
      categories: [Categories.FOOD],
      publics: {},
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      gcu: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
