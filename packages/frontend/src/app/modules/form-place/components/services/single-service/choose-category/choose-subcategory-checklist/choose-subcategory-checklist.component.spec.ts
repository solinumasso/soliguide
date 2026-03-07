import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { ChooseSubCategoryChecklistComponent } from "./choose-subcategory-checklist.component";
import { Service } from "../../../../../../../models";

describe("ChooseSubCategoryChecklistComponent", () => {
  let component: ChooseSubCategoryChecklistComponent;
  let fixture: ComponentFixture<ChooseSubCategoryChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseSubCategoryChecklistComponent],
      imports: [TranslateModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseSubCategoryChecklistComponent);
    component = fixture.componentInstance;

    component.service = new Service();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
