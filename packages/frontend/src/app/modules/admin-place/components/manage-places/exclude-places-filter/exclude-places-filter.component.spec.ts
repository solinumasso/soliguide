import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { ExcludePlacesFilterComponent } from "./exclude-places-filter.component";
import { Categories } from "@soliguide/common";
import { CategoryTranslateKeyPipe } from "../../../../shared/pipes";

describe("ExcludePlacesFilterComponent", () => {
  let component: ExcludePlacesFilterComponent;
  let fixture: ComponentFixture<ExcludePlacesFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExcludePlacesFilterComponent, CategoryTranslateKeyPipe],
      imports: [FormsModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcludePlacesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle on option", () => {
    component.toggleCheckboxButton(Categories.FOUNTAIN);
    expect(component.categoriesToExclude).toStrictEqual([Categories.FOUNTAIN]);
  });
});
