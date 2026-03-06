import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LegalNoticesSoliguideFrComponent } from "./legal-notices-soliguide-fr.component";

describe("LegalNoticesSoliguideFrComponent", () => {
  let component: LegalNoticesSoliguideFrComponent;
  let fixture: ComponentFixture<LegalNoticesSoliguideFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalNoticesSoliguideFrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticesSoliguideFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
