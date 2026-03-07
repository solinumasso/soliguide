import { TranslateModule } from "@ngx-translate/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../../shared/shared.module";

import { HelpSearchComponent } from "./help-search.component";

describe("HelpSearchComponent", () => {
  let component: HelpSearchComponent;
  let fixture: ComponentFixture<HelpSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpSearchComponent],
      imports: [SharedModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
