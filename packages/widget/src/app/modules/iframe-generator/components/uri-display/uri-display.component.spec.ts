import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  GeoTypes,
  PublicsGender,
  WidgetId,
} from "@soliguide/common";

import { UriDisplayComponent } from "./uri-display.component";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";

import { WIDGETS } from "../../../../models";
import { SharedModule } from "../../../shared/shared.module";

describe("UriDisplayComponent", () => {
  let component: UriDisplayComponent;
  let fixture: ComponentFixture<UriDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UriDisplayComponent],
      imports: [FormsModule, SharedModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UriDisplayComponent);
    component = fixture.componentInstance;
    component.formValue = {
      email: "",
      organizationName: "",
      widgetId: WidgetId.SOLINUM,
      cities: [
        {
          geoValue: "paris",
          geoType: GeoTypes.CITY,
          label: "Paris",
          slugs: {},
          coordinates: [],
        },
        {
          geoValue: "lyon",
          geoType: GeoTypes.CITY,
          label: "Lyon",
          slugs: {},
          coordinates: [],
        },
      ],
      departments: [
        {
          geoValue: "seine-saint-denis",
          geoType: GeoTypes.DEPARTMENT,
          label: "Seine-Saint-Denis",
          slugs: {},
          coordinates: [],
        },
        {
          geoValue: "morbihan",
          geoType: GeoTypes.DEPARTMENT,
          label: "Paris",
          slugs: {},
          coordinates: [],
        },
      ],
      regions: [
        {
          geoValue: "occitanie",
          geoType: GeoTypes.REGION,
          label: "Occitanie",
          slugs: {},
          coordinates: [],
        },
      ],
      national: true,
      categories: [
        Categories.FOOD,
        Categories.SOLIDARITY_STORE,
        Categories.CLOTHING,
      ],
      publics: { gender: [PublicsGender.women] },
      modalities: { orientation: true, pmr: true },
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      gcu: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
