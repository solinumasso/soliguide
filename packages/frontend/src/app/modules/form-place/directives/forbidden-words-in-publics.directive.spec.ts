import { Component, DebugElement, Input } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { ForbiddenValidatorDirective } from "./forbidden-words-in-publics.directive";

@Component({
  template: `
    <textarea
      #control="ngModel"
      appForbiddenWordsInPublics
      [(ngModel)]="inputText"
    ></textarea>
    <div *ngIf="control.hasError" class="test"></div>
  `,
})
class TestComponent {
  @Input() public inputText: string;
}

describe("ForbiddenWordsInPublicsDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debug: DebugElement[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ForbiddenValidatorDirective],
      imports: [FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.inputText = "RDV";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("the textarea should have error", () => {
    debug = fixture.debugElement.queryAll(By.css("div.test"));
    expect(debug.length).toBe(1);
  });
});
