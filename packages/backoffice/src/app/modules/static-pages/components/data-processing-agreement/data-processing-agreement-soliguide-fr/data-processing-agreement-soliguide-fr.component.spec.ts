import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataProcessingAgreementSoliguideFrComponent } from "./data-processing-agreement-soliguide-fr.component";

describe("DataProcessingAgreementSoliguideFrComponent", () => {
  let component: DataProcessingAgreementSoliguideFrComponent;
  let fixture: ComponentFixture<DataProcessingAgreementSoliguideFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataProcessingAgreementSoliguideFrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DataProcessingAgreementSoliguideFrComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
