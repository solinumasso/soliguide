import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { SelectCategoryComponent } from "./select-category.component";
import { CategoryTranslateKeyPipe } from "../../pipes";
import {
  Categories,
  initializeCategoriesByTheme,
  Themes,
} from "@soliguide/common";

beforeAll(() => {
  initializeCategoriesByTheme(Themes.SOLIGUIDE_FR);
});

describe("SelectCategoryComponent", () => {
  let component: SelectCategoryComponent;
  let fixture: ComponentFixture<SelectCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCategoryComponent, CategoryTranslateKeyPipe],
      imports: [TranslateModule.forRoot({})],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCategoryComponent);
    component = fixture.componentInstance;
    component.categories = [];
    jest
      .spyOn(component.selectedCategories, "emit")
      .mockImplementation(
        (categories) => (component.categories = categories ?? [])
      );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("update categories", () => {
    it("should update correcly with a service", () => {
      expect(component.categories).toStrictEqual([]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([Categories.LEGAL_ADVICE]);
      component.selectCategory(Categories.ADDICTION_PREVENTION_AND_MATERIAL);
      expect(component.categories).toStrictEqual([
        Categories.ADDICTION_PREVENTION_AND_MATERIAL,
        Categories.LEGAL_ADVICE,
      ]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([
        Categories.ADDICTION_PREVENTION_AND_MATERIAL,
      ]);
    });

    it("should update correctly with a category", () => {
      expect(component.categories).toStrictEqual([]);
      component.selectCategory(Categories.LEGAL_ADVICE);
      expect(component.categories).toStrictEqual([Categories.LEGAL_ADVICE]);
      component.selectCategory(Categories.SPORT_ACTIVITIES);
      expect(component.categories).toStrictEqual([
        Categories.LEGAL_ADVICE,
        Categories.SPORT_ACTIVITIES,
      ]);
      component.selectCategory(Categories.ACTIVITIES);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
      ]);
      component.selectCategory(Categories.HEALTH);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.HEALTH,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
        Categories.HEALTH_COVERAGE,
        Categories.FIND_HEALTHCARE,
        Categories.GENERAL_PRACTITIONER,
        Categories.HEALTH_ASSESSMENT,
        Categories.CHILD_CARE,
        Categories.DENTAL_CARE,
        Categories.OPTICAL_CARE,
        Categories.HEARING_CARE,
        Categories.INFIRMARY,
        Categories.VACCINATION,
        Categories.STD_TESTING,
        Categories.CHRONIC_DISEASES,
        Categories.NUTRITION,
        Categories.MEDICAL_ACCOMMODATION,
        Categories.PSYCHOLOGICAL_SUPPORT,
        Categories.PSYCHIATRY,
        Categories.SUPPORT_GROUPS,
        Categories.MENTAL_HEALTH_EDUCATION,
        Categories.THERAPEUTIC_ACTIVITIES,
        Categories.ADDICTION_CARE,
        Categories.ADDICTION_PREVENTION_AND_MATERIAL,
        Categories.EMERGENCY_CONTRACEPTION,
        Categories.ABORTION,
        Categories.CONTRACEPTION,
        Categories.GYNECOLOGY,
        Categories.STI_PREVENTION_TESTING,
        Categories.HIV_PREVENTION,
        Categories.SEXUAL_HEALTH_VACCINATION,
        Categories.SEXUAL_HEALTH_EDUCATION,
        Categories.SEXUAL_VIOLENCE_SUPPORT,
        Categories.AFFECTIVE_LIFE,
        Categories.PREGNANCY_CARE,
        Categories.PARENT_ASSISTANCE,
        Categories.ALLERGOLOGY,
        Categories.CARDIOLOGY,
        Categories.DERMATOLOGY,
        Categories.ENDOCRINOLOGY,
        Categories.GASTROENTEROLOGY,
        Categories.KINESITHERAPY,
        Categories.OTORHINOLARYNGOLOGY,
        Categories.SPEECH_THERAPY,
        Categories.OSTEOPATHY,
        Categories.PEDICURE,
        Categories.PHLEBOLOGY,
        Categories.PNEUMOLOGY,
        Categories.RADIOLOGY,
        Categories.RHEUMATOLOGY,
        Categories.STOMATOLOGY,
        Categories.UROLOGY,
        Categories.VET_CARE,
      ]);
      component.selectCategory(Categories.HEALTH);
      expect(component.categories).toStrictEqual([
        Categories.ACTIVITIES,
        Categories.LEGAL_ADVICE,
      ]);
      expect(component.categoriesToHide).toStrictEqual([
        Categories.SPORT_ACTIVITIES,
        Categories.MUSEUMS,
        Categories.LIBRARIES,
        Categories.OTHER_ACTIVITIES,
      ]);
    });
  });
});
