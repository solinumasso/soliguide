import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { NoResultComponent } from "./no-result.component";

import { PosthogService } from "../../../analytics/services/posthog.service";

import {
  CommonPosthogMockService,
  MockAuthService,
} from "../../../../../../mocks";
import { AuthService } from "../../../users/services/auth.service";
import { RouterModule } from "@angular/router";

describe("NoResultComponent", () => {
  let component: NoResultComponent;
  let fixture: ComponentFixture<NoResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NoResultComponent],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
