import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { PrivacyPolicySoliguiaCaComponent } from "./privacy-policy-soliguia-ca.component";
import { RouterModule } from "@angular/router";

describe("PrivacyPolicySoliguiaCaComponent", () => {
  let component: PrivacyPolicySoliguiaCaComponent;
  let fixture: ComponentFixture<PrivacyPolicySoliguiaCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicySoliguiaCaComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicySoliguiaCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
