import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataProcessingAgreementSoliguiaEsComponent } from "./data-processing-agreement-soliguia-es.component";

describe("DataProcessingAgreementSoliguiaEsComponent", () => {
  let component: DataProcessingAgreementSoliguiaEsComponent;
  let fixture: ComponentFixture<DataProcessingAgreementSoliguiaEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataProcessingAgreementSoliguiaEsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DataProcessingAgreementSoliguiaEsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
