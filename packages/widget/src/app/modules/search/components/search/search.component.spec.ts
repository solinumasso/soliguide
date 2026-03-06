import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  CountryCodes,
  GeoTypes,
  SupportedLanguagesCode,
  WidgetId,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { SearchComponent } from "./search.component";

import { Search } from "../../../../models";

describe("SearchComponent", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              widgetId: WidgetId.CRF,
              lang: SupportedLanguagesCode.FR,
              category: "food",
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    const expectedSearch = new Search({
      category: Categories.FOOD,
      lang: SupportedLanguagesCode.FR,
      location: {
        label: "Paris",
        coordinates: [2.3522219, 48.856614],
        geoType: GeoTypes.CITY,
        geoValue: "paris-75",
        slugs: {},

        areas: {
          slugs: {},
          country: CountryCodes.FR,
          pays: "france",
          regionCode: "11",
          department: "Paris",
          departmentCode: "75",
          postalCode: "75009",
          region: "Île-de-France",
          city: "Paris",
        },
        distance: 5,
      },
      locations: [],
      modalities: undefined,
      options: {
        limit: 10,
        page: 1,
      },
      widgetId: WidgetId.CRF,
    });
    // Otherwise word == undefined for some reason... This delete is similar to what happens un ngOnInit.
    delete expectedSearch.word;
    expect(component).toBeTruthy();
    expect(component.search).toStrictEqual(expectedSearch);
  });
});
