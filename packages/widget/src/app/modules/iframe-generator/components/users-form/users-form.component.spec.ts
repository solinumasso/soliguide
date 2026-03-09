import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { WidgetId } from "@soliguide/common";

import { UsersFormComponent } from "./users-form.component";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";

import { WIDGETS } from "../../../../models";

describe("UsersFormComponent", () => {
  let component: UsersFormComponent;
  let fixture: ComponentFixture<UsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersFormComponent],
      imports: [FormsModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFormComponent);
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
