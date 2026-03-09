import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";

import { Categories, PublicsElement, WidgetId } from "@soliguide/common";

import { PublicsDropdownComponent } from "./publics-dropdown.component";

import { CommonPosthogMockService } from "../../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../../analytics/services/posthog.service";

import { WIDGETS } from "../../../../../models";
import { SharedModule } from "../../../../shared/shared.module";

describe("PublicsDropdownComponent", () => {
  let component: PublicsDropdownComponent;
  let fixture: ComponentFixture<PublicsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicsDropdownComponent],

      imports: [SharedModule, FormsModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicsDropdownComponent);
    component = fixture.componentInstance;
    component.label = "GENDER";
    component.prop = PublicsElement.GENDER;
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
