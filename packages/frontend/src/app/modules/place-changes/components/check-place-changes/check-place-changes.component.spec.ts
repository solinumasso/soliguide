import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { CheckPlaceChangesComponent } from "./check-place-changes.component";

import { PLACE_CHANGES_MOCK } from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";

describe("CheckPlaceChangesComponent", () => {
  let component: CheckPlaceChangesComponent;
  let fixture: ComponentFixture<CheckPlaceChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckPlaceChangesComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPlaceChangesComponent);
    component = fixture.componentInstance;
    component.placeChanges = PLACE_CHANGES_MOCK;
    component.changeIndex = 1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
