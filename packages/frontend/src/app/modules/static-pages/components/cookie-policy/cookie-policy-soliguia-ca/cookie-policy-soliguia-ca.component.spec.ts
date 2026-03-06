import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CookiePolicySoliguiaCaComponent } from "./cookie-policy-soliguia-ca.component";

describe("CookiePolicySoliguiaCaComponent", () => {
  let component: CookiePolicySoliguiaCaComponent;
  let fixture: ComponentFixture<CookiePolicySoliguiaCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookiePolicySoliguiaCaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiePolicySoliguiaCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
