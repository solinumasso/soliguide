import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { DisplayPhotosComponent } from "./display-photos.component";

import { Place } from "../../../../models/place/classes";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayPhotosComponent", () => {
  let component: DisplayPhotosComponent;
  let fixture: ComponentFixture<DisplayPhotosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPhotosComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPhotosComponent);
    component = fixture.componentInstance;
    const place = new Place();
    component.photos = place.photos;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
