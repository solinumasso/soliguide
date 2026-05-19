import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { GcuSoliguiaCaComponent } from "./gcu-soliguia-ca.component";
import { RouterModule } from "@angular/router";

describe("GcuSoliguiaCaComponent", () => {
  let component: GcuSoliguiaCaComponent;
  let fixture: ComponentFixture<GcuSoliguiaCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GcuSoliguiaCaComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GcuSoliguiaCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
