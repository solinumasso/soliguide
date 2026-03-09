import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { AutoExportPlaceComponent } from "./auto-export-place.component";

describe("AutoExportPlaceComponent", () => {
  let component: AutoExportPlaceComponent;
  let fixture: ComponentFixture<AutoExportPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutoExportPlaceComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoExportPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
