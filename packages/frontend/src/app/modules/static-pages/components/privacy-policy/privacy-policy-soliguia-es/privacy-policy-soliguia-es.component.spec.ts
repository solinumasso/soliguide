import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { PrivacyPolicySoliguiaEsComponent } from "./privacy-policy-soliguia-es.component";
import { RouterModule } from "@angular/router";

describe("PrivacyPolicySoliguiaCaComponent", () => {
  let component: PrivacyPolicySoliguiaEsComponent;
  let fixture: ComponentFixture<PrivacyPolicySoliguiaEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicySoliguiaEsComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicySoliguiaEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
