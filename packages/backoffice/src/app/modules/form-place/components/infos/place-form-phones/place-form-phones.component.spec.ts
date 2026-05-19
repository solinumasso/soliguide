import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { PlaceFormPhonesComponent } from "./place-form-phones.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../../shared";

describe("PhonesComponent", () => {
  let component: PlaceFormPhonesComponent;
  let fixture: ComponentFixture<PlaceFormPhonesComponent>;

  const formBuilder = new FormBuilder();
  const form = formBuilder.group({
    entity: formBuilder.group({ phones: formBuilder.array([]) }),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceFormPhonesComponent],
      imports: [ReactiveFormsModule, SharedModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceFormPhonesComponent);
    component = fixture.componentInstance;
    component.parentForm = form.controls.entity as FormGroup;
    component.phonesData = [];
    component.phonesForm = form.controls.entity.get("phones") as FormArray;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
