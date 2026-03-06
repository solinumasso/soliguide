import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { WidgetId } from "@soliguide/common";

import { LocationsFormComponent } from "./locations-form.component";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { SharedModule } from "../../../shared/shared.module";

import { WIDGETS } from "../../../../models";

describe("LocationsFormComponent", () => {
  let component: LocationsFormComponent;
  let fixture: ComponentFixture<LocationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationsFormComponent],
      imports: [FormsModule, SharedModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsFormComponent);
    component = fixture.componentInstance;
    component.formValue = {
      email: "",
      organizationName: "",
      cities: [],
      departments: [],
      national: false,
      regions: [],
      widgetId: WidgetId.SOLINUM,
      categories: [],
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      gcu: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
