import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { ContactComponent } from "./contact.component";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("ContactComponent", () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
