import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { PrivacyPolicySoliguideFrComponent } from "./privacy-policy-soliguide-fr.component";
import { RouterModule } from "@angular/router";

describe("PrivacyPolicySoliguideFrComponent", () => {
  let component: PrivacyPolicySoliguideFrComponent;
  let fixture: ComponentFixture<PrivacyPolicySoliguideFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyPolicySoliguideFrComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicySoliguideFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
