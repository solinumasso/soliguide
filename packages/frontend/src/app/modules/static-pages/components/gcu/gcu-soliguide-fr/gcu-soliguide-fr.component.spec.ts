import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { GcuSoliguideFrComponent } from "./gcu-soliguide-fr.component";
import { RouterModule } from "@angular/router";

describe("GcuSoliguideFrComponent", () => {
  let component: GcuSoliguideFrComponent;
  let fixture: ComponentFixture<GcuSoliguideFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GcuSoliguideFrComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GcuSoliguideFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
