import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { AideTradComponent } from "./aide-trad.component";

describe("AideTradComponent", () => {
  let component: AideTradComponent;
  let fixture: ComponentFixture<AideTradComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AideTradComponent],
      imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AideTradComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
