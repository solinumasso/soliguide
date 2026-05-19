import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { DisplayPublicsInlineComponent } from "./display-publics-inline.component";

import { Publics } from "@soliguide/common";
import { SharedModule } from "../../../shared/shared.module";

describe("DisplayPublicsInlineComponent", () => {
  let component: DisplayPublicsInlineComponent;
  let fixture: ComponentFixture<DisplayPublicsInlineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPublicsInlineComponent],
      imports: [
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        SharedModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPublicsInlineComponent);
    component = fixture.componentInstance;
    component.publics = new Publics();
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
