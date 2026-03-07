import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { DisplayLanguagesAdminComponent } from "./display-languages-admin.component";

describe("DisplayLanguagesAdminComponent", () => {
  let component: DisplayLanguagesAdminComponent;
  let fixture: ComponentFixture<DisplayLanguagesAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
      declarations: [DisplayLanguagesAdminComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayLanguagesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
