import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GcuComponent } from "./gcu.component";
import { NgComponentOutlet } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SeoService } from "../../../shared/services";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { GcuService } from "../../services/gcu.service";

describe("GcuComponent", () => {
  let component: GcuComponent;
  let fixture: ComponentFixture<GcuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        SeoService,
        GcuService,
        CurrentLanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GcuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
