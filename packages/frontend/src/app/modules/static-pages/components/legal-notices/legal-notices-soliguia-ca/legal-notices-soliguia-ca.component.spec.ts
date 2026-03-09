import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LegalNoticesSoliguiaCaComponent } from "./legal-notices-soliguia-ca.component";

describe("LegalNoticesSoliguiaCaComponent", () => {
  let component: LegalNoticesSoliguiaCaComponent;
  let fixture: ComponentFixture<LegalNoticesSoliguiaCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalNoticesSoliguiaCaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticesSoliguiaCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
