import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { UpdatedAtFilterComponent } from "./updated-at-filter.component";
import { AdminSearchPlaces } from "../../../classes";
import { USER_PRO_MOCK } from "../../../../../../../mocks/USER_PRO.mock";
import { User } from "../../../../users/classes";

describe("UpdatedAtFilterComponent", () => {
  let component: UpdatedAtFilterComponent;
  let fixture: ComponentFixture<UpdatedAtFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdatedAtFilterComponent],
      imports: [NgbModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedAtFilterComponent);
    component = fixture.componentInstance;
    component.search = new AdminSearchPlaces({}, new User(USER_PRO_MOCK));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
