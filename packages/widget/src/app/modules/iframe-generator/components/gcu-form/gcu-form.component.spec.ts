import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { WidgetId } from "@soliguide/common";

import { GcuFormComponent } from "./gcu-form.component";

import { WIDGETS } from "../../../../models";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("GcuFormComponent", () => {
  let component: GcuFormComponent;
  let fixture: ComponentFixture<GcuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GcuFormComponent],
      imports: [
        FormsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GcuFormComponent);
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
