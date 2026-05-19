import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayPlaceChangesSectionsComponent } from "./display-place-changes-sections.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { PLACE_CHANGES_MOCK } from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";

describe("DisplayPlaceChangesSectionsComponent", () => {
  let component: DisplayPlaceChangesSectionsComponent;
  let fixture: ComponentFixture<DisplayPlaceChangesSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPlaceChangesSectionsComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayPlaceChangesSectionsComponent);
    component = fixture.componentInstance;
    component.placeChanges = PLACE_CHANGES_MOCK;
    component.photosChanged = true;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
