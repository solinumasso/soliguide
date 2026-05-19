import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import {
  PublicsAdministrative,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";
import { SearchNavComponent } from "./search-nav.component";
import { Search } from "../../interfaces";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CategoryTranslateKeyPipe } from "../../../shared/pipes";

describe("SearchNavComponent", () => {
  let component: SearchNavComponent;
  let fixture: ComponentFixture<SearchNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchNavComponent, CategoryTranslateKeyPipe],
      imports: [
        HttpClientTestingModule,
        NgbModule,
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
    fixture = TestBed.createComponent(SearchNavComponent);
    component = fixture.componentInstance;
    component.search = new Search({
      languages: SupportedLanguagesCode.UK,
      modalities: { inconditionnel: true },
      publics: { administrative: [PublicsAdministrative.refugee] },
    });
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
