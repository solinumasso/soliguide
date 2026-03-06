import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { JourPassageFormComponent } from "./jour-passage.component";

describe("JourPassageFormComponent", () => {
  let component: JourPassageFormComponent;
  let fixture: ComponentFixture<JourPassageFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [JourPassageFormComponent],
      imports: [TranslateModule.forRoot({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourPassageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
