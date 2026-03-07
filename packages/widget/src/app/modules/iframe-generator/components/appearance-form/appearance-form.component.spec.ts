import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { Categories, PublicsGender, WidgetId } from "@soliguide/common";

import { AppearanceFormComponent } from "./appearance-form.component";

import { WIDGETS } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";

describe("AppearanceFormComponent", () => {
  let component: AppearanceFormComponent;
  let fixture: ComponentFixture<AppearanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppearanceFormComponent],
      imports: [FormsModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceFormComponent);
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
      publics: { gender: [PublicsGender.women] },
      modalities: {},
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      gcu: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
