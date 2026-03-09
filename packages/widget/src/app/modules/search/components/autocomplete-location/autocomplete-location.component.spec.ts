import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  CountryCodes,
  GeoPosition,
  GeoTypes,
  SupportedLanguagesCode,
  WidgetId,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { AutocompleteLocationComponent } from "./autocomplete-location.component";

import { Search } from "../../../../models";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";

describe("AutocompleteLocationComponent", () => {
  let component: AutocompleteLocationComponent;
  let fixture: ComponentFixture<AutocompleteLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteLocationComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteLocationComponent);
    component = fixture.componentInstance;
    component.search = new Search({
      widgetId: WidgetId.CRF,
      category: Categories.FOOD,
      lang: SupportedLanguagesCode.FR,
      location: new GeoPosition({
        label: "Paris",
        coordinates: [2.3522219, 48.856614],
        geoType: GeoTypes.CITY,
        country: CountryCodes.FR,
        regionCode: "11",
        departmentCode: "75",
        postalCode: "75009",
        department: "Paris",
        region: "Île-de-France",
        city: "Paris",
        distance: 5,
        geoValue: "paris",
      }),
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
