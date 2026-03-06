import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { SoligareMatchingComponent } from "./soligare-matching.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("SoligareMatchingComponent", () => {
  let component: SoligareMatchingComponent;
  let fixture: ComponentFixture<SoligareMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoligareMatchingComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: { source_id: "123", source: "Test" } },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoligareMatchingComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });
});
