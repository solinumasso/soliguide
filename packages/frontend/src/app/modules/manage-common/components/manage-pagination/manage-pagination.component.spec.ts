import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ManagePaginationComponent } from "./manage-pagination.component";

describe("ManagePaginationComponent", () => {
  let component: ManagePaginationComponent;
  let fixture: ComponentFixture<ManagePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
