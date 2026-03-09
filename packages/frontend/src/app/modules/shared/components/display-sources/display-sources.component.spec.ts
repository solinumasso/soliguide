import { TranslateModule } from "@ngx-translate/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DisplaySourcesComponent } from "./display-sources.component";

describe("DisplaySourcesComponent", () => {
  let component: DisplaySourcesComponent;
  let fixture: ComponentFixture<DisplaySourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplaySourcesComponent],
      imports: [TranslateModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplaySourcesComponent);
    component = fixture.componentInstance;
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
