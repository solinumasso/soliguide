import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ModalitiesToggleComponent } from "./modalities-toggle.component";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ModalitiesToggleComponent", () => {
  let component: ModalitiesToggleComponent;
  let fixture: ComponentFixture<ModalitiesToggleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalitiesToggleComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalitiesToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should toggle switch and emit event when buttons are clicked", () => {
    component.toggleSwitch(false);

    expect(component.checked).toBe(false);

    component.toggleSwitch(true);

    expect(component.checked).toBe(true);
  });

  it("should have initial state set", () => {
    expect(component.checked).toBeUndefined();
  });
});
