import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

import { SelectAvailableSourceComponent } from "./select-available-source.component";
import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { USER_SOLIGUIDE_MOCK } from "../../../../../../mocks/USER_SOLIGUIDE.mock";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

class MockAuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      USER_SOLIGUIDE_MOCK
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

describe("SelectAvailableSourceComponent", () => {
  let component: SelectAvailableSourceComponent;
  let fixture: ComponentFixture<SelectAvailableSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAvailableSourceComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectAvailableSourceComponent);
    component = fixture.componentInstance;
    component.territories = ["22", "75"];
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display 'custom_source_name'", () => {
    expect(component.stringToDisplay).toEqual("NONE");
    component.toggleCheckboxButton("custom_source_name");
    expect(component.stringToDisplay).toEqual("custom_source_name");
  });
});
