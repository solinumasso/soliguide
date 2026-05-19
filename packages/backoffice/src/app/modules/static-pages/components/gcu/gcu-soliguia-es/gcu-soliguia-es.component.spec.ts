import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { GcuSoliguiaEsComponent } from "./gcu-soliguia-es.component";
import { RouterModule } from "@angular/router";

describe("GcuSoliguiaEsComponent", () => {
  let component: GcuSoliguiaEsComponent;
  let fixture: ComponentFixture<GcuSoliguiaEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GcuSoliguiaEsComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(GcuSoliguiaEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
