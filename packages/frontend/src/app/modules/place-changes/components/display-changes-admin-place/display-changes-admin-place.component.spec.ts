import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ToastrModule } from "ngx-toastr";

import { DisplayChangesAdminPlaceComponent } from "./display-changes-admin-place.component";

import { PlaceChanges } from "../../../../models/place-changes";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ONLINE_PLACE_MOCK } from "./../../../../../../mocks";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../../shared";
import { registerLocales } from "../../../../shared";

describe("DisplayChangesAdminPlaceComponent", () => {
  let component: DisplayChangesAdminPlaceComponent;
  let fixture: ComponentFixture<DisplayChangesAdminPlaceComponent>;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayChangesAdminPlaceComponent],
      imports: [
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayChangesAdminPlaceComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.changes = [new PlaceChanges()];
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
