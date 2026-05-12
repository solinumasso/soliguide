import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";

import { DisplayPlaceChangesComponent } from "./display-place-changes.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { PlaceChangesSection } from "@soliguide/common";
import { TranslateModule } from "@ngx-translate/core";
import { Place } from "../../../../models";
import { PlaceChangesTypeEdition } from "../../../../models/place-changes";

describe("DisplayPlaceChangesComponent", () => {
  let component: DisplayPlaceChangesComponent;
  let fixture: ComponentFixture<DisplayPlaceChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPlaceChangesComponent],
      imports: [
        NgbModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPlaceChangesComponent);
    component = fixture.componentInstance;

    const oldPlace = {
      services_all: [
        { serviceObjectId: 1, name: "Service 1" },
        { serviceObjectId: 2, name: "Service 2" },
      ],
    } as unknown as Place;
    const newPlace = {
      services_all: [
        { serviceObjectId: 2, name: "Updated Service 2" },
        { serviceObjectId: 3, name: "New Service 3" },
      ],
    } as unknown as Place;

    component.oldPlace = oldPlace;
    component.placeChanged = newPlace;
    component.section = PlaceChangesSection.services;
    component.changeSection = "new";
    component.photosChanged = false;
    component.changesDate = ONLINE_PLACE_MOCK.updatedAt;
    component.typeOfEdition = PlaceChangesTypeEdition.EDIT;

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.added).toEqual([
      { serviceObjectId: 3, name: "New Service 3" },
    ]);
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.edited).toEqual([
      { serviceObjectId: 2, name: "Updated Service 2" },
    ]);
  });

  it("should compare services correctly", () => {
    expect(component.servicesChanges.deleted).toEqual([
      { serviceObjectId: 1, name: "Service 1" },
    ]);

    expect(component.servicesChanges.unchanged).toEqual([]);
  });
});
