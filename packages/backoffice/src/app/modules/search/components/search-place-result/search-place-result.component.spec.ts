import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { SearchPlaceResultComponent } from "./search-place-result.component";

import { SharedModule } from "../../../shared/shared.module";

import { Place } from "../../../../models/place/classes";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { Search } from "../../interfaces";

describe("SearchPlaceResultComponent", () => {
  let component: SearchPlaceResultComponent;
  let fixture: ComponentFixture<SearchPlaceResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPlaceResultComponent],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlaceResultComponent);
    component = fixture.componentInstance;
    component.search = new Search();
    component.place = new Place();
    component.place.position.postalCode = "75015";
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
