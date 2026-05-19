import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";
import { ManageTradPlacesComponent } from "./manage-trad-places.component";
import { ManageCommonModule } from "../../../manage-common/manage-common.module";
import { SharedModule } from "../../../shared/shared.module";
import { AuthService } from "../../../users/services/auth.service";

import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { CountryCodes, ManageSearchOptions } from "@soliguide/common";
import { FormsModule } from "@angular/forms";

describe("ManageTradPlacesComponent", () => {
  let component: ManageTradPlacesComponent;
  let fixture: ComponentFixture<ManageTradPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTradPlacesComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ManageCommonModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTradPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return default search option", () => {
    const DEFAULT_SEARCH_OPTIONS = new ManageSearchOptions();

    DEFAULT_SEARCH_OPTIONS.sortBy = "createdAt";

    expect(component.search).toEqual({
      country: CountryCodes.FR,
      lieu_id: null,
      options: DEFAULT_SEARCH_OPTIONS,
      territories: [],
    });
  });

  it("should sort results by lieu_id", () => {
    component.sortBy("lieu_id");
    expect(component.search.options.sortBy).toBe("lieu_id");
  });

  it("should reset search options", () => {
    component.resetSearchArgument("lieu_id");
    expect(component.search.lieu_id).toBeNull();
  });
});
