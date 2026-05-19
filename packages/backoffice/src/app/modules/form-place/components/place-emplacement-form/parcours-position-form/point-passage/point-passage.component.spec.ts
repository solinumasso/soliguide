import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { FormPointPassageComponent } from "./point-passage.component";

import { OpeningHours } from "@soliguide/common";
import {
  PlaceParcours,
  PlacePosition,
} from "../../../../../../models/place/classes";

const point: PlaceParcours = {
  description: "",
  hours: new OpeningHours(),
  position: new PlacePosition(),
  photos: [],
  show: false,
};

describe("FormPointPassageComponent", () => {
  let component: FormPointPassageComponent;
  let fixture: ComponentFixture<FormPointPassageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormPointPassageComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot({})],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPointPassageComponent);
    component = fixture.componentInstance;
    component.point = point;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set a description", () => {
    component.setDescription("Un test");
    expect(component.point.description).toBe("Un test");
  });

  it("should toggle the show variable", () => {
    component.point.show = true;
    component.toggleShow();
    expect(component.point.show).toBe(false);
  });
});
