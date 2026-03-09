import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DevenirBenevoleComponent } from "./devenir-benevole.component";

describe("DevenirBenevoleComponent", () => {
  let component: DevenirBenevoleComponent;
  let fixture: ComponentFixture<DevenirBenevoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevenirBenevoleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevenirBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
