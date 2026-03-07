import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { AutoExportOptionComponent } from "./auto-export-option.component";

describe("AutoExportOptionComponent", () => {
  let component: AutoExportOptionComponent;
  let fixture: ComponentFixture<AutoExportOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoExportOptionComponent],
      imports: [FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoExportOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
