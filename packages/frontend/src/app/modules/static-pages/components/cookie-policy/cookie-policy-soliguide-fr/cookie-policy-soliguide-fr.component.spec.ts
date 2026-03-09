import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CookiePolicySoliguideFrComponent } from "./cookie-policy-soliguide-fr.component";

describe("CookiePolicySoliguideFrComponent", () => {
  let component: CookiePolicySoliguideFrComponent;
  let fixture: ComponentFixture<CookiePolicySoliguideFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiePolicySoliguideFrComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiePolicySoliguideFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
