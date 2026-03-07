import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { BasePlaceTempInfo } from "@soliguide/common";
import { endDateAfterBeginDateValidator } from "../../../../../shared/validators";

import { FormStartAndEndDateFicheComponent } from "./start-and-end-date.component";
import { TranslateModule } from "@ngx-translate/core";

const today = new Date();
const yesterday = new Date(today);

yesterday.setDate(today.getDate() - 1);

const reactiveObject = new FormGroup(
  {
    dateDebut: new FormControl(today),
    dateFin: new FormControl(null),
  },
  endDateAfterBeginDateValidator({
    beginDateControlName: "dateDebut",
    endDateControlName: "dateFin",
  })
);

describe("FormStartAndEndDateFicheComponent", () => {
  let component: FormStartAndEndDateFicheComponent;
  let fixture: ComponentFixture<FormStartAndEndDateFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormStartAndEndDateFicheComponent],
      imports: [
        ToastrModule.forRoot({}),
        NgbModule,
        FormsModule,
        TranslateModule.forRoot(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStartAndEndDateFicheComponent);
    component = fixture.componentInstance;
    component.object = new BasePlaceTempInfo({
      dateDebut: today,
      dateFin: null,
    });
    component.parentFormGroup = reactiveObject;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Reactive Form", () => {
    it("should set today for the starting date", () => {
      component.getToday("dateDebut");
      expect(component.parentFormGroup.controls.dateDebut.value.getDate()).toBe(
        today.getDate()
      );
    });

    it("should set today for the ending date", () => {
      component.getToday("dateFin");
      expect(component.parentFormGroup.controls.dateFin.value.getDate()).toBe(
        today.getDate()
      );
    });
  });
  describe("NgModel Form", () => {
    it("should set today for the starting date", () => {
      component.getToday("dateDebut");
      expect(component.object.dateDebut?.getDate()).toBe(today.getDate());
    });

    it("should set today for the ending date", () => {
      component.getToday("dateFin");
      expect(component.object.dateFin?.getDate()).toBe(today.getDate());
    });
  });
});
