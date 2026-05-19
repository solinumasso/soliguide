import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { DisplayGeneralInfoAdminComponent } from "./display-general-info-admin.component";

import { Place } from "../../../../models/place/classes";

describe("DisplayGeneralInfoAdminComponent", () => {
  let component: DisplayGeneralInfoAdminComponent;
  let fixture: ComponentFixture<DisplayGeneralInfoAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayGeneralInfoAdminComponent],
      imports: [
        BrowserModule,
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayGeneralInfoAdminComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
