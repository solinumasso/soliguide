import { ToastrModule } from "ngx-toastr";
import { RouterModule } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

import { ListPlacesComponent } from "./list-places.component";
import { USER_PRO_MOCK } from "../../../../../../mocks/USER_PRO.mock";
import { User } from "../../../users/classes/user.class";
import { ORGANIZATION_MOCK } from "../../../../../../mocks/ORGANIZATION.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("ListPlacesComponent", () => {
  let component: ListPlacesComponent;
  let fixture: ComponentFixture<ListPlacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListPlacesComponent],
      imports: [
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(ListPlacesComponent);
    component = fixture.componentInstance;
    component.organisation = ORGANIZATION_MOCK;
    component.me = new User(USER_PRO_MOCK);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
