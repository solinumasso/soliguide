import { HttpClientTestingModule } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { of } from "rxjs";

import { CanReadChangeGuard } from "./can-read-change.guard";

import { PlaceChanges } from "../models/place-changes";
import { PlaceChangesService } from "../modules/place-changes/services/place-changes.service";

import { PLACE_CHANGES_MOCK } from "../../../mocks";
import { THEME_CONFIGURATION } from "../models";

describe("CanReadChangeGuard", () => {
  let injector: TestBed;
  let canReadChangeGuard: CanReadChangeGuard;
  let placeChangesService: PlaceChangesService;
  let route: ActivatedRouteSnapshot;
  let router: Router;
  let toastr: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          {
            path: THEME_CONFIGURATION.defaultLanguage,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [CanReadChangeGuard],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    placeChangesService = injector.inject(PlaceChangesService);
    canReadChangeGuard = injector.inject(CanReadChangeGuard);
    router = injector.inject(Router);
    toastr = injector.inject(ToastrService);
    jest.spyOn(router, "navigate");
    jest.spyOn(toastr, "error");
    route = new ActivatedRouteSnapshot();
    route.params = { id: "changeObjectId " };
  });

  it("should return 'false' if the user can't read the change", () => {
    jest
      .spyOn(placeChangesService, "getVersion")
      .mockReturnValueOnce(of(new PlaceChanges()));
    canReadChangeGuard
      .canActivate(route)
      .subscribe((res) => expect(res).toBe(false));
    expect(router.navigate).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalled();
  });

  it("should return 'true' if the user can read the change", () => {
    jest
      .spyOn(placeChangesService, "getVersion")
      .mockReturnValueOnce(of(PLACE_CHANGES_MOCK));
    canReadChangeGuard
      .canActivate(route)
      .subscribe((res) => expect(res).toBe(true));
  });
});
