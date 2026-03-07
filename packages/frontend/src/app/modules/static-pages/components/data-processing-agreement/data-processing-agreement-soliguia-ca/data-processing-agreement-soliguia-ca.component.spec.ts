import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataProcessingAgreementSoliguiaCaComponent } from "./data-processing-agreement-soliguia-ca.component";

describe("DataProcessingAgreementSoliguiaCaComponent", () => {
  let component: DataProcessingAgreementSoliguiaCaComponent;
  let fixture: ComponentFixture<DataProcessingAgreementSoliguiaCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataProcessingAgreementSoliguiaCaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DataProcessingAgreementSoliguiaCaComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
