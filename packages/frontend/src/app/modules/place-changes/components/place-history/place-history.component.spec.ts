import { SharedModule } from "./../../../shared/shared.module";
import { ManageCommonModule } from "./../../../manage-common/manage-common.module";
import { RouterModule } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaceHistoryComponent } from "./place-history.component";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  ONLINE_PLACE_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";
import { Place } from "../../../../models";
import { SearchPlaceChanges } from "../../classes";

describe("PlaceHistoryComponent", () => {
  let component: PlaceHistoryComponent;
  let fixture: ComponentFixture<PlaceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgbAccordionModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
        ManageCommonModule,
        SharedModule,
        FormsModule,
      ],
      declarations: [PlaceHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceHistoryComponent);
    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    component.search = new SearchPlaceChanges(
      { userData: { status: null } },
      USER_SOLIGUIDE_MOCK
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
