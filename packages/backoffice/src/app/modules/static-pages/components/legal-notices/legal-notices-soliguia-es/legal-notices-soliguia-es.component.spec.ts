import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LegalNoticesSoliguiaEsComponent } from "./legal-notices-soliguia-es.component";

describe("LegalNoticesSoliguiaEsComponent", () => {
  let component: LegalNoticesSoliguiaEsComponent;
  let fixture: ComponentFixture<LegalNoticesSoliguiaEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalNoticesSoliguiaEsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticesSoliguiaEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
