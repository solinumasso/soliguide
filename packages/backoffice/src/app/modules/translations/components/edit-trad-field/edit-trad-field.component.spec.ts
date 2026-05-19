import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { EditTradFieldComponent } from "./edit-trad-field.component";
import { TranslateModule } from "@ngx-translate/core";

describe("EditTradFieldComponent", () => {
  let component: EditTradFieldComponent;
  let fixture: ComponentFixture<EditTradFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTradFieldComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTradFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
