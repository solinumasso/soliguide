import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CookiePolicySoliguiaEsComponent } from "./cookie-policy-soliguia-es.component";

describe("CookiePolicySoliguiaEsComponent", () => {
  let component: CookiePolicySoliguiaEsComponent;
  let fixture: ComponentFixture<CookiePolicySoliguiaEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiePolicySoliguiaEsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiePolicySoliguiaEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
