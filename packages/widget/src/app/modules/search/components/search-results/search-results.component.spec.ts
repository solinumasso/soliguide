import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  CountryCodes,
  GeoTypes,
  SupportedLanguagesCode,
  WidgetId,
} from "@soliguide/common";

import { SearchResultsComponent } from "./search-results.component";

import { DEFAULT_WIDGET_PLACE, Search } from "../../../../models";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";

describe("SearchResultsComponent", () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultsComponent],
      imports: [NoopAnimationsModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    component.places = [DEFAULT_WIDGET_PLACE];
    component.search = new Search({
      widgetId: WidgetId.CRF,
      category: Categories.FOOD,
      lang: SupportedLanguagesCode.FR,
      location: {
        areas: {
          slugs: {},
          country: CountryCodes.FR,
          pays: "france",
          regionCode: "11",
          departmentCode: "75",
          postalCode: "75009",
          department: "Paris",
          region: "Île-de-France",
          city: "Paris",
        },
        coordinates: [2.3522219, 48.856614],
        distance: 5,
        geoType: GeoTypes.CITY,
        geoValue: "paris",
        label: "Paris",
        slugs: {},
      },
      options: {
        limit: 10,
      },
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
