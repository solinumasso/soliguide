import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocationAutocompleteComponent } from "./location-autocomplete.component";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { SearchService } from "../../../search/services/search.service";
import { Search } from "../../../search/interfaces";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { LocationService } from "../../services";

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => {
      return "";
    },
  }),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("LocationAutocompleteComponent", () => {
  let component: LocationAutocompleteComponent;
  let fixture: ComponentFixture<LocationAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        SearchService,
        LocationService,
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationAutocompleteComponent);
    component = fixture.componentInstance;

    component.search = new Search();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
