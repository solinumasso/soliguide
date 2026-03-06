import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageMultipleSelectComponent } from "./manage-multiple-select.component";
import { CAMPAIGN_LIST } from "@soliguide/common";
import { CAMPAIGN_NAME_LABELS } from "../../../../models";
import { TranslateModule } from "@ngx-translate/core";

describe("ManageMultipleSelectComponent", () => {
  let component: ManageMultipleSelectComponent;
  let fixture: ComponentFixture<ManageMultipleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMultipleSelectComponent],
      imports: [TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMultipleSelectComponent);
    component = fixture.componentInstance;
    component.allOptionsLabel = "Toutes les campagnes";
    component.anyOptionLabel = "Aucune campagne";
    component.options = Object.keys(CAMPAIGN_LIST);
    component.optionLabels = CAMPAIGN_NAME_LABELS;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
